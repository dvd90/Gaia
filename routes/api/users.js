const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

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
      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        d: "mm"
      });

      // Waiting for quiz to update this field
      // const planet_consuption = "3.4";

      user = new User({
        name,
        email,
        password,
        avatar,
        address,
        planet_consuption
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: { id: user.id }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          console.log(`${user.name} just created an account 🎉`);
          return res.json({ token });
        }
      );

      //   res.send("User Registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route PUT api/users
// @desc Update my user
// @access Private

router.put(
  "/",
  [auth, [check("email", "Please include a valid email").isEmail()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address } = req.body;

    try {
      // Check if user exist
      let user = await User.findById(req.user.id);

      if (!user) return res.status(404).json({ msg: "User not found" });

      if (user._id.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });

      if (address) user.address = address;
      if (name) user.name = name;
      if (email) {
        const avatar = gravatar.url(email, {
          s: "200",
          d: "mm"
        });
        user.email = email;
        user.avatar = avatar;
      }

      await user.save();
      return res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
