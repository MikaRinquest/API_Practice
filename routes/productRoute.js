const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const con = require("../library/db_connection");

// Get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Get single
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM products WHERE product_id = "${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result[0]);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add new
router.post("/", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    // the below allows you to only need one const, but every input required is inside of the brackets
    const {
      sku,
      name,
      price,
      weight,
      descriptions,
      thumbnail,
      image,
      category,
      create_date,
      stock,
    } = req.body;
    // OR
    // the below requires you to add everything one by one
    //   const email = req.body.email;
    try {
      con.query(
        //When using the ${}, the content of con.query MUST be in the back tick
        `INSERT INTO products (
    sku,
    name,
    price,
    weight,
    descriptions,
    thumbnail,
    image,
    category,
    create_date,
    stock) VALUES ("${sku}", "${name}", "${price}", "${weight}", "${descriptions}", "${thumbnail}", "${image}", "${category}", "${create_date}", "${stock}") `,
        (err, result) => {
          if (err) throw err;
          res.send(result[0]);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    res.send("You are not an admin");
  }
});

// Edit
router.put("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    const {
      sku,
      name,
      price,
      weight,
      descriptions,
      thumbnail,
      image,
      category,
      create_date,
      stock,
    } = req.body;

    try {
      con.query(
        `UPDATE products 
     SET sku = "${sku}", name = "${name}", price = "${price}", weight = "${weight}", descriptions = "${descriptions}", thumbnail = "${thumbnail}", image = "${image}", category = "${category}", create_date = "${create_date}", stock = "${stock}" WHERE product_id = "${req.params.id}"`,
        (err, result) => {
          if (err) throw err;
          res.send(result[0]);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    res.send("You are not an admin");
  }
});

// Delete
router.delete("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    try {
      con.query(
        `DELETE FROM products WHERE product_id = "${req.params.id}" `,
        (err, result) => {
          if (err) throw err;
          res.send(result[0]);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    res.send("You are not an admin");
  }
});

module.exports = router;
