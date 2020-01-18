const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route GET api/challenges
// @desc
// @access Public

router.get("/", (req, res) => res.send("challenges routes"));

module.exports = router;
