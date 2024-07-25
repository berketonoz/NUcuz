/*jshint esversion: 8 */

const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3030;

app.use(cors());
app.use(require("body-parser").urlencoded({ extended: false }));

const products_data = JSON.parse(fs.readFileSync("data/products.json", "utf8"));

mongoose.connect("mongodb://mongo_db:27017/", { dbName: "productsDB" });

const Products = require("./product");

try {
  Products.deleteMany({}).then(() => {
    Products.insertMany(products_data.products);
  });
} catch (error) {
  console.log("Error: ", error);
}

// Express route to home
app.get("/", async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get("/products", async (req, res) => {
  try {
    console.log("Fetching products...");
    const products = await Products.find();
    res.status(200).json(products);
    console.log("Fetched");
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
