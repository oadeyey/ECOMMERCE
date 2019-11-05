const express = require("express");
const router = express.Router();

//@route    GET
//@desc     Auth Route
//@access   Public

router.get("/", (req, res) => {
  res.send("Auth Route");
});

//Export Router

module.exports = router;
