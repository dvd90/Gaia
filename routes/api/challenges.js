const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Challenge = require("../../models/Challenge");

const isObjectIdError = err =>
  err.kind === "ObjectId" || err.name === "CastError";

// @route GET api/challenges
// @desc get all challenges
// @access Public

router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("creator", ["name", "avatar"])
      .sort({ date: -1 });

    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route POST api/challenges
// @desc create a new challenge
// @access Private

router.post(
  "/",
  [
    auth,
    [
      check("title", "title is required")
        .not()
        .isEmpty(),
      check("category", "category is required")
        .not()
        .isEmpty(),
      check("description", "description is required")
        .not()
        .isEmpty(),
      check("gaia_points", "gaia_points need to be positive").isInt({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const newChallenge = new Challenge({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        gaia_points: req.body.gaia_points,
        creator: req.user.id
      });

      const challenge = await newChallenge.save();

      res.json(challenge);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route GET api/challenges/:id
// @desc Get a challenge by ID
// @access Public

router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) return res.status(404).json({ msg: "challenge not found" });

    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "challenge not found" });

    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT api/challenges/:id/join
// @desc Join a Challenge
// @access Private

router.put("/:id/join", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) return res.status(404).json({ msg: "challenge not found" });

    const alreadyJoined = challenge.joined_by.some(
      obj => obj.user.toString() === req.user.id
    );

    if (alreadyJoined)
      return res.status(400).json({ msg: "You already joined this challenge" });

    challenge.joined_by.push({ user: req.user.id, status: "In Progress" });
    await challenge.save();

    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "challenge not found" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT api/challenges/:id/completed
// @desc Complete a Challenge
// @access Private

router.put("/:id/completed", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) return res.status(404).json({ msg: "challenge not found" });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const joined = challenge.joined_by.find(
      obj => obj.user.toString() === req.user.id
    );

    if (!joined)
      return res
        .status(400)
        .json({ msg: "You must join this challenge before completing it" });

    if (joined.status === "Completed")
      return res.status(400).json({ msg: "Challenge already completed" });

    // Add Gaia points to User
    joined.status = "Completed";
    user.gaia_points += challenge.gaia_points;

    await challenge.save();
    await user.save();
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "challenge not found" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route DELETE api/challenges/:id
// @desc Delete a challenge by ID
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) return res.status(404).json({ msg: "challenge not found" });

    // Only the creator can delete a challenge
    if (challenge.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await challenge.deleteOne();

    res.json({ msg: "challenge removed" });
  } catch (err) {
    console.error(err.message);
    if (isObjectIdError(err))
      return res.status(404).json({ msg: "challenge not found" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT api/challenges/:id
// @desc edit a challenge by id
// @access Private

router.put(
  "/:id",
  [
    auth,
    [
      check("gaia_points", "gaia_points need to be positive")
        .optional()
        .isInt({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const challenge = await Challenge.findById(req.params.id);
      if (!challenge)
        return res.status(404).json({ msg: "challenge not found" });

      // Only the creator can edit a challenge
      if (challenge.creator.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });

      const { title, category, description, gaia_points } = req.body;

      if (title) challenge.title = title;
      if (category) challenge.category = category;
      if (description) challenge.description = description;
      if (gaia_points) challenge.gaia_points = gaia_points;

      await challenge.save();
      return res.json(challenge);
    } catch (err) {
      console.error(err.message);
      if (isObjectIdError(err))
        return res.status(404).json({ msg: "challenge not found" });
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
