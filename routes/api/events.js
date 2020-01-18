const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route GET api/events
// @desc
// @access Public

router.get("/", (req, res) => res.send("events routes"));

module.exports = router;
