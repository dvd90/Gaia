const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Event = require("../../models/Event");

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
    res.status(500).send("Server Error");
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
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const newEvent = new Event({
        title: req.body.title,
        location: req.body.location,
        // Dates need to be sent MM-DD-YY
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        description: req.body.description,
        creator: req.user.id
      });

      const event = await newEvent.save();

      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
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
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "event not found" });

    res.status(500).send("Server Error");
  }
});

// @route PUT api/event/:id/join
// @desc Join a Event
// @access Private

router.put("/:id/join", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    let notExist = true;
    event.attendees.forEach(obj => {
      if (obj.user.toString() === req.user.id) {
        notExist = false;
      }
    });
    if (notExist) {
      event.attendees.push({ user: req.user.id });
      await event.save();

      res.json(event);
    } else {
      res.json({ msg: "You already joined this event" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/events/:id
// @desc Delete a event by ID
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    // Check user ID

    if (!event) return res.status(404).json({ msg: "event not found" });

    if (event.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await event.remove();

    res.json({ msg: "event removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "event not found" });
    res.status(500).send("Server Error");
  }
});

// @route Put api/events
// @desc edit a event by id
// @access Private

router.put("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "event not found" });

    if (event.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    const title = req.body.title;
    const starts_at = req.body.starts_at;
    const ends_at = req.body.ends_at;
    const location = req.body.location;
    const description = req.body.description;

    if (title) event.title = title;
    if (starts_at) event.starts_at = starts_at;
    if (ends_at) event.ends_at = ends_at;
    if (location) event.location = location;
    if (description) event.description = description;

    await event.save();
    return res.json(event);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
