const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const fetch = require("node-fetch");

app.listen(8000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "etailor",
  password: "Bird14",
  port: 5432,
});

//==============================================================eTailor==========================================================

app.get("/products", function (req, res) {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      data.map((event) => {
        pool
          .query("SELECT * FROM products WHERE product_name=$1", [event.title])
          .then((result) => {
            if (result.rows.length > 0) {
              return res
                .status(400)
                .send("A Customer with the same name already exists!");
            } else {
              const query =
                "INSERT INTO products (product_name, category, unit_price, image) VALUES ($1, $2, $3, $4)";
              pool
                .query(query, [
                  event.title,
                  event.category,
                  event.price,
                  event.image,
                ])
                .then(() => res.send("Products created!"))
                .catch((e) => console.error(e));
            }
          });
      });
    });
});
