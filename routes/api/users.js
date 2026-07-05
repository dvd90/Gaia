const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const { generateToken } = require("../../utils/generateToken");

const User = require("../../models/User");

const gravatarUrl = email => gravatar.url(email, { s: "200", d: "mm" });

// @route POST api/users
// @desc Register user
// @access Public

router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("address", "Address is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, planet_consuption } = req.body;

    try {
      // Check if user exist
      let user = await User.findOne({ email });

      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });

      user = new User({
        name,
        email,
        password,
        avatar: gravatarUrl(email),
        address,
        planet_consuption
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      console.log(`${user.name} just created an account 🎉`);

      // Return jsonwebtoken
      return res.json({ token: generateToken(user.id) });
    } catch (err) {
      // Duplicate key: another request registered this email first
      if (err.code === 11000)
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route PUT api/users
// @desc Update my user
// @access Private

router.put(
  "/",
  [
    auth,
    [
      check("email", "Please include a valid email")
        .optional()
        .isEmail()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (!user) return res.status(404).json({ msg: "User not found" });

      if (address) user.address = address;
      if (name) user.name = name;
      if (email && email !== user.email) {
        // Make sure the new email is not taken by someone else
        const taken = await User.findOne({ email });
        if (taken)
          return res.status(400).json({ msg: "Email already in use" });

        user.email = email;
        user.avatar = gravatarUrl(email);
      }

      await user.save();

      const safeUser = user.toObject();
      delete safeUser.password;
      return res.json(safeUser);
    } catch (err) {
      if (err.code === 11000)
        return res.status(400).json({ msg: "Email already in use" });
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
