/*jshint esversion: 8 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const products = new Schema({
//   id: {
//     type: Number,
//     required: true,
//   },
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  wireless: {
    type: Boolean,
  },
  customizable: {
    type: Boolean,
  }

});

module.exports = mongoose.model("products", products);
