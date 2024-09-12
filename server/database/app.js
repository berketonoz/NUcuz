/*jshint esversion: 8 */

const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const { PubSub } = require("@google-cloud/pubsub");
const { BigQuery } = require("@google-cloud/bigquery");

const app = express();
const port = 3030;

const pubSubClient = new PubSub();
const bigqueryClient = new BigQuery();

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase limit as needed
app.use(require("body-parser").urlencoded({ extended: false, limit: "50mb" }));

// mongoose.connect("mongodb://mongo_db:27017/", { dbName: "productsDB" });

const Products = require("./product");

// app.get("/test-connection", async (req, res) => {
//   try {
//     await mongoose.connection.db.admin().ping();
//     res.status(200).send("Connection to MongoDB is successful");
//   } catch (error) {
//     res.status(500).send("Error connecting to MongoDB");
//   }
// });

const expectedAttributes = [
  "asin",
  "product_title",
  "product_price",
  "product_original_price",
  "currency",
  "product_star_rating",
  "product_num_ratings",
  "product_url",
  "product_photo",
  "product_num_offers",
  "product_minimum_offer_price",
  "is_best_seller",
  "is_amazon_choice",
  "is_prime",
  "climate_pledge_friendly",
  "sales_volume",
  "delivery",
  "has_variations",
  "country",
];

// Express route to home
app.get("/", async (req, res) => {
  res.send("Welcome to the Express API");
});

app.get("/product/:asin", async (req, res) => {  
  const asin = req.params.asin;
  
  let sql =
      "SELECT * \
        FROM `codeway-case-study-427613.amazon.products` \
        WHERE asin = " + `'${asin}'`;

  const options = { query: sql, location: "US" };
  const [response] = await bigqueryClient.query(options);
  
  res.json(response);
});

app.get("/products", async (req, res) => {
  try {
    let response = {
      status: "",
      products: "",
    };
    let sql =
      "SELECT * \
        FROM `codeway-case-study-427613.amazon.productsV2` \
        ORDER BY RAND() \
        LIMIT 4";

    const options = { query: sql, location: "US" };

    const [bqResponse] = await bigqueryClient.query(options);

    if (bqResponse.length > 0) {
      response.products = bqResponse;
      response.status = 200;
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching documents:", error); // Log the full error
    res
      .status(500)
      .json({ error: "Error fetching documents", details: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    let sql = "";
    if (req.body) console.log(req.body);

    console.log("SQL: ", sql);

    // const options = { query: sql, location: "US" };

    // const [response] = await bigqueryClient.query(options);

    res.status(200).json(sql);
  } catch (error) {
    console.error("Error fetching documents:", error); // Log the full error
    res
      .status(500)
      .json({ error: "Error fetching documents", details: error.message });
  }
});

// Endpoint to publish data to Pub/Sub
app.post("/load_amazon", async (req, res) => {
  const topicName = "projects/codeway-case-study-427613/topics/amazon";

  try {
    const products = req.body;
    for (const product of products) {  
      const dataBuffer = Buffer.from(JSON.stringify(product));
      const messageId = await pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
      console.log(
        `Message ${messageId} published for product ${product.asin}`
      );
    }

    res.status(201).json({ message: "Products published to Pub/Sub" });
  } catch (error) {
    console.error("Error publishing to Pub/Sub:", error);
    res.status(500).json({ error: "Error publishing to Pub/Sub" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
