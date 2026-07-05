const express = require("express");
const router = express.Router();
const footprintApiData = require("../../config/footprintApiData");

// @route GET api/footprint/:country_id
// @desc Get how many Earths a country's lifestyle consumes
// @access Public

router.get("/:country_id", (req, res) => {
  const id = parseInt(req.params.country_id, 10);

  const country = footprintApiData.find(element => element.countryCode === id);

  if (!country)
    return res.status(404).json({ msg: "No country with this code" });

  res.json({
    earths: country.value,
    countryName: country.countryName
  });
});

module.exports = router;
