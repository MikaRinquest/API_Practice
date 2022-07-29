const express = require("express");
const router = express.Router();
const con = require("../library/db_connection");
const middleware = require("../middleware/auth");

// Get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM orders", (err, result) => {
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
      `SELECT * FROM orders WHERE order_id = "${req.params.id}"`,
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
    const {
      user_id,
      amount,
      shipping_address,
      order_email,
      order_date,
      order_status,
    } = req.body;

    try {
      con.query(
        `INSERT INTO orders (
    user_id, amount, shipping_address, order_email, order_date, order_status ) VALUES ("${user_id}","${amount}", "${shipping_address}", "${order_email}", "${order_date}", "${order_status}") `,
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
router.patch("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    const {
      user_id,
      amount,
      shipping_address,
      order_email,
      order_date,
      order_status,
    } = req.body;

    try {
      con.query(
        `UPDATE orders 
     SET user_id = "${user_id}", amount = "${amount}", shipping_address = "${shipping_address}", order_email = "${order_email}", order_date = "${order_date}", order_status = "${order_status}"  WHERE order_id = "${req.params.id}"`,
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
        `DELETE FROM orders WHERE order_id = "${req.params.id}"  `,
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
