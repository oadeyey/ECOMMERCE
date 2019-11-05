const express = require("express");
const router = express.Router();

//@route    GET
//@desc     Coupons Route
//@access   Public

router.get("/", (req, res) => {
  res.send("Coupons Route");
});

//Export Router

module.exports = router;
