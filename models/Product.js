const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Category: [{ type: String, required: true }],
  Image: {
    type: String
  },
  Quantity: { type: Number }
});

module.exports = Product = mongoose.model("Product", ProductSchema);
