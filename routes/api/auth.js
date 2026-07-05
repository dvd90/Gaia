const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { generateToken } = require("../../utils/generateToken");

// @route GET api/auth
// @desc Get the logged-in user
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exist
      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });

      // Check if password match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });

      // Return jsonwebtoken
      return res.json({ token: generateToken(user.id) });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
