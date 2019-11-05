const express = require("express");
const Product = require("../models/Product");
const { check, validationResult } = require("express-validator");
const adminauth = require("../middleware/adminauth");

const router = express.Router();

//Insert Products Route
//@route POST ecom/products/addproduct
//@desc Insert Product
//@access Public
router.post(
  "/addproduct",
  [
    adminauth,
    [
      check("Title", "Product Title is required")
        .not()
        .isEmpty(),
      check("Price", "Price is required").isNumeric(),
      check("Category", "Enter at least One Category")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { Title, Price, Category, Image, Quantity } = req.body;

      let product = new Product({
        Title,
        Price,
        Category,
        Image,
        Quantity
      });

      await product.save();

      res.json({ product });
    } catch (err) {
      res.status(500).send("Server Error");
      console.error(err.message);
    }
  }
);

//Update Products Route
//@route  PUT '/ecom/products/:product_id'
//@desc   Update Product
//@access Private
router.put("/:product_id", adminauth, (req, res) => {});

//Delete Products Route
//@route  DELETE '/ecom/products/:product_id'
//@desc   Delete Product
//@access Private
router.delete("/:product_id", adminauth, (req, res) => {});

//Display Products Route
//@route  GET '/ecom/products'
//@desc   Get all products
//@access Public
router.get("/", (req, res) => {
  const products = Product.find();
  res.json(products);
});

//Export Router

module.exports = router;
