const express = require('express');
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const adminauth = require('../middleware/adminauth');

const router = express.Router();

//Insert Products Route
//@route POST ecom/products/addproduct
//@desc Insert Product
//@access Public
router.post(
  '/addproduct',
  [
    adminauth,
    [
      check('Title', 'Product Title is required').not().isEmpty(),
      check('Price', 'Price is required').isNumeric(),
      check('Category', 'Enter at least One Category').not().isEmpty()
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
      res.status(500).send('Server Error');
      console.error(err.message);
    }
  }
);

//Update Products Route
//@route  PUT '/ecom/products/:product_id'
//@desc   Update Product
//@access Private
router.put('/:product_id', adminauth, async (req, res) => {
  const { Title, Price, Category, Image, Quantity } = req.body;

  let newProduct = {
    Title,
    Price,
    Category,
    Image,
    Quantity
  };
  console.log(req.params.product_id);
  console.log(newProduct);
  try {
    let product = await Product.findById(req.params.product_id);

    if (!product) {
      res.status(400).json({ error: [{ msg: 'Product Does not exist' }] });
    }

    // product.Title = Title;
    // product.Price = Price;
    // product.Category = Category;
    // if (Image) {
    //   product.Image = Image;
    // }
    // if (Quantity) {
    //   product.Quantity = Quantity;
    // }

    if (!Image && product.Image) {
      newProduct.Image = product.Image;
    }
    if (!Quantity && product.Quantity) {
      newProduct.Quantity = product.Quantity;
    }

    const upProduct = await Product.findOneAndUpdate(
      { _id: req.params.product_id },
      { $set: newProduct },
      { new: true }
    );
    console.log(upProduct);
    res.json(upProduct);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send('Server Error');
  }
});

//Delete Products Route
//@route  DELETE '/ecom/products/:product_id'
//@desc   Delete Product
//@access Private
router.delete('/:product_id', adminauth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.product_id);

    if (!product) {
      res.status(404).json({ msg: 'Product not found' });
    }
    product.remove();

    res.json({ msg: 'Product Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Display Products Route
//@route  GET '/ecom/products'
//@desc   Get all products
//@access Public
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

//Export Router

module.exports = router;
