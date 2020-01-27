const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Challenge = require("../../models/Challenge");

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
    res.status(500).send("Server Error");
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
      check("gaia_points", "gaia_point need to be positive").isInt({ min: 1 })
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
      res.status(500).send("Server Error");
    }
  }
);

//------------------------------// TO COPY
// @route Put api/challenges
// @desc edit a challenge by id
// @access Private

router.put("/:id",auth,async (req, res) => {
    try {
      const challenge = await Challenge.findById(req.params.id);
      if (!challenge) return res.status(404).json({ msg: "challenge not found" });

      if (challenge.creator.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });

        const title = req.body.title;
        const category= req.body.category;
        const description= req.body.description;
        const gaia_points= req.body.gaia_points;

      if (title) challenge.title = title;
      if (category) challenge.category = category;
      if (description) challenge.description=description;
      if (gaia_points) challenge.gaia_points = gaia_points;

      await challenge.save();
      return res.json(challenge);
    } 
    catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);
//------------------------------// TO COPY

// @route GET api/challenges/:id
// @desc Get an event by ID
// @access Public

router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) return res.status(404).json({ msg: "challenge not found" });

    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "challenge not found" });

    res.status(500).send("Server Error");
  }
});

// @route PUT api/challenges/:id/join
// @desc Join a Challenge
// @access Private

router.put("/:id/join", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    let notExist = true;
    challenge.joined_by.forEach(obj => {
      if (obj.user.toString() === req.user.id) {
        notExist = false;
      }
    });
    if (notExist) {
      challenge.joined_by.push({ user: req.user.id, status: "In Progress" });
      await challenge.save();

      res.json(challenge);
    } else {
      res.json({ msg: "You already joined this challenge" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/challenges/:id/completed
// @desc Complete a Challenge
// @access Private

router.put("/:id/completed", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const challenge = await Challenge.findById(req.params.id);
    challenge.joined_by.forEach(obj => {
      if (obj.user.toString() === req.user.id) {
        // Add Gaia point to User
        if (obj.status !== "Completed") {
          user.gaia_points += challenge.gaia_points;
          obj.status = "Completed";
        } else {
          res.json({ msg: "Challenge already completed" });
        }
      }
    });
    await challenge.save();
    await user.save();
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/challenges/:id
// @desc Delete a challenge by ID
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    // Check user ID

    if (!challenge) return res.status(404).json({ msg: "challenge not found" });

    if (challenge.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await challenge.remove();

    res.json({ msg: "challenge removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "challenge not found" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
