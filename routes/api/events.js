const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const axios = require("axios");
const Event = require("../../models/Event");

const isObjectIdError = err =>
  err.kind === "ObjectId" || err.name === "CastError";

// Geocode a free-text location with Mapbox; returns a GeoJSON geometry or null
const geocodeLocation = async location => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=${process.env.MAP_BOX_KEY}`;

  const geocoded = await axios.get(url);
  const feature = geocoded.data.features && geocoded.data.features[0];
  return feature ? feature.geometry : null;
};

// @route GET api/events
// @desc get all events
// @access Public

router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("creator", ["name", "avatar"])
      .sort({ date: -1 });

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route POST api/events
// @desc create a new event
// @access Private

router.post(
  "/",
  [
    auth,
    [
      check("title", "title is required")
        .not()
        .isEmpty(),
      check("location", "location is required")
        .not()
        .isEmpty(),
      check("description", "description is required")
        .not()
        .isEmpty(),
      check("starts_at", "starts_at must be a valid date").isISO8601(),
      check("ends_at", "ends_at must be a valid date").isISO8601()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const coords = await geocodeLocation(req.body.location);

      if (!coords)
        return res
          .status(400)
          .json({ errors: [{ msg: "Could not locate this address" }] });

      const newEvent = new Event({
        title: req.body.title,
        location: req.body.location,
        coords,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        description: req.body.description,
        creator: req.user.id
      });

      const event = await newEvent.save();

      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route GET api/events/:id
// @desc Get an event by ID
// @access Public

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "event not found" });

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "event not found" });

    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT api/events/:id/join
// @desc Join an Event
// @access Private

router.put("/:id/join", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "event not found" });

    const alreadyJoined = event.attendees.some(
      obj => obj.user.toString() === req.user.id
    );

    if (alreadyJoined)
      return res.status(400).json({ msg: "You already joined this event" });

    event.attendees.push({ user: req.user.id });
    await event.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "event not found" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route DELETE api/events/:id
// @desc Delete an event by ID
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "event not found" });

    // Only the creator can delete an event
    if (event.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await event.remove();

    res.json({ msg: "event removed" });
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "event not found" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT api/events/:id
// @desc edit an event by id
// @access Private

router.put(
  "/:id",
  [
    auth,
    [
      check("starts_at", "starts_at must be a valid date")
        .optional()
        .isISO8601(),
      check("ends_at", "ends_at must be a valid date")
        .optional()
        .isISO8601()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ msg: "event not found" });

      // Only the creator can edit an event
      if (event.creator.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });

      const { title, starts_at, ends_at, location, description } = req.body;

      if (title) event.title = title;
      if (starts_at) event.starts_at = starts_at;
      if (ends_at) event.ends_at = ends_at;
      if (description) event.description = description;
      if (location && location !== event.location) {
        // Keep the map pin in sync with the new address
        const coords = await geocodeLocation(location);
        if (!coords)
          return res
            .status(400)
            .json({ errors: [{ msg: "Could not locate this address" }] });
        event.location = location;
        event.coords = coords;
      }

      await event.save();
      return res.json(event);
    } catch (err) {
      console.error(err.message);
      if (isObjectIdError(err))
        return res.status(404).json({ msg: "event not found" });
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
