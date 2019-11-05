const express = require("express");
const router = express.Router();
const adminauth = require("../middleware/adminauth");
const config = require("config");
const AdminUser = require("../models/AdminUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");

// @route   GET'/ecom/administrator
// @desc    Get all administrators
// @access  private
router.get("/", adminauth, async (req, res) => {
  try {
    const adminusers = await AdminUser.find()
      .where("_id")
      .ne(req.user.id)
      .select("-password");
    res.json(adminusers);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST'/ecom/administrator/login
// @desc    Login Admin User
// @access  public

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const adminuser = await AdminUser.findOne({ email });
      if (!adminuser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, adminuser.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: adminuser.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtAdminSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST'/ecom/administrator/createadminuser
// @desc    Create Admin User
// @access  public

router.post(
  "/createadminuser",
  [
    adminauth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("email", "Email is required").isEmail(),
      check("password", "Password must be at least 6 characters").isLength({
        min: 6
      })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let adminuser = await AdminUser.findOne({ email });

      if (adminuser) {
        res.status(400).json({ errors: [{ msg: "User already Exists" }] });
      }

      //Get users avatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      adminuser = new AdminUser({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);
      adminuser.password = await bcrypt.hash(password, salt);

      adminuser.save();

      const payload = {
        user: {
          id: adminuser.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtAdminSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
