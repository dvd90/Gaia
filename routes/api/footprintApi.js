const express = require("express");
const router = express.Router();
const footprintApiData = require("../../config/footprintApiData");

// Api footPrint

router.get("/:country_id", (req, res) => {
  const id = req.params.country_id;
  if (id) {
    const country = footprintApiData.find(
      element => element.countryCode === parseInt(id)
    );
    return res.json({
      earths: country.value,
      countryName: country.countryName
    });
  } else {
    res.status(400).json({ msg: "No country with this code" });
  }
});

module.exports = router;
