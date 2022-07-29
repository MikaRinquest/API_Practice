const express = require("express");
const router = express.Router();
const con = require("../library/db_connection");
const middleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Gets all users
router.get("/", middleware, (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Gets one users
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users WHERE user_id = ${req.params.id}`,
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

// Add new user
// router.post("/", (req, res) => {
//   // the below allows you to only need one const, but every input required is inside of the brackets
//   const {
//     email,
//     password,
//     full_name,
//     billing_address,
//     default_shipping_address,
//     country,
//     phone,
//     user_type,
//   } = req.body;
//   // OR
//   // the below requires you to add everything one by one
//   //   const email = req.body.email;
//   try {
//     con.query(
//       //When using the ${}, the content of con.query MUST be in the back tick
//       `INSERT INTO users (email,
//     password,
//     full_name,
//     billing_address,
//     default_shipping_address,
//     country,
//     phone, user_type) VALUES ("${email}", "${password}", "${full_name}", "${billing_address}", "${default_shipping_address}", "${country}", "${phone}", "${user_type}") `,
//       (err, result) => {
//         if (err) throw err;
//         res.send(result);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });

// Log in user
// router.patch("/", (req, res) => {
//   // NB!!! Only use req.params when pulling information from the url
//   const { email, password } = req.body;
//   try {
//     con.query(
//       `SELECT * FROM users WHERE email = "${email}" AND password = "${password}" `,
//       (err, result) => {
//         if (err) throw err;
//         res.send(result[0]);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });

// Edit user

router.put("/:id", (req, res) => {
  const {
    email,
    password,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    phone,
    user_type,
  } = req.body;
  try {
    con.query(
      `UPDATE users SET email = "${email}", password = "${password}", full_name = "${full_name}", billing_address="${billing_address}", default_shipping_address ="${default_shipping_address}", country ="${country}", phone = "${phone}", user_type = "${user_type}" WHERE user_id = "${req.params.id}"  `,
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

// Delete user
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM users WHERE user_id = "${req.params.id}"  `,
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

// Register a user
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const {
      full_name,
      email,
      password,
      user_type,
      phone,
      country,
      billing_address,
      default_shipping_address,
    } = req.body;

    // Start of encryption
    const salt = bcrypt.genSaltSync(10); //Length of the characters
    const hash = bcrypt.hashSync(password, salt); //Will cause the password to become encrypted

    let user = {
      full_name,
      email,
      // We sending the hash value to be stored witin the table
      password: hash, //This gives whatever value the password is will have a hash value and send that hash value to the table
      user_type,
      phone,
      country,
      billing_address,
      default_shipping_address,
    };

    // Connection to the database
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Login
router.post("/login", (req, res) => {
  //The res here is the original
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      //If result is changed to res, the original res will no longer work
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          // The information that should be stored inside token
          const payload = {
            user: {
              user_id: result[0].user_id,
              full_name: result[0].full_name,
              email: result[0].email,
              user_type: result[0].user_type,
              phone: result[0].phone,
              country: result[0].country,
              billing_address: result[0].billing_address,
              default_shipping_address: result[0].default_shipping_address,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);

      res.send(decodedToken);
    }
  });
});

router.get("/", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

//` {
//      "full_name": "Isma'eel Adams",
//       "email": "issy@gmail.com",
//       "password": "dog",
//       "user_type": "client",
//       "phone": "123456",
//       "country": "South Africa",
//       "billing_address": "home",
//       "default_shipping_address": "home"
// }`

// {
//     "email": "mikar@gmail.com",
//     "password": "doggo",
//     "full_name": "Mika Rinquest",
//     "billing_address": "motherland",
//     "default_shipping_address": "fatherland",
//     "country": "South Africa",
//     "phone": "0817079992",
//     "user_type": "admin"
//   }
