const express = require("express");
const router = express.Router();

//@route    GET
//@desc     Orders Route
//@access   Public

router.get("/", (req, res) => {
  res.send("Orders Route");
});

//Export Router

module.exports = router;
