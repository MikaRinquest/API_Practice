const express = require("express");
const router = express.Router();
const con = require("../library/db_connection");
const middleware = require("../middleware/auth");

// Get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM categories", (err, result) => {
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
      `SELECT * FROM categories WHERE category_id = "${req.params.id}"`,
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
    const { name, description, thumbnail } = req.body;

    try {
      con.query(
        `INSERT INTO categories (
    name, description, thumbnail) VALUES ("${name}", "${description}", "${thumbnail}") `,
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
    const { name, description, thumbnail } = req.body;

    try {
      con.query(
        `UPDATE categories 
     SET name = "${name}", description = "${description}", thumbnail = "${thumbnail}"  WHERE category_id = "${req.params.id}"`,
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
        `DELETE FROM categories WHERE category_id = "${req.params.id}"  `,
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
