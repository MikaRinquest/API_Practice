const express = require("express");
const router = express.Router();
const con = require("../library/db_connection");
const middleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const controller = require("../Controllers/Auth/Auth");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Gets all users
router.get("/", (req, res) => {
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
  return controller.register(req, res);
});

// Login
router.post("/login", (req, res) => {
  return controller.login(req, res);
});

// Verify
router.get("/users/verify", (req, res) => {
  // Login
  // ` Get Token

  // Admin Dash (user_type === admin)
  // ` user_type = user
  // Attach middleware
  // add header

  // Verify
  // After Login
  // Decodes the token
  // Gets user assigned to token
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

// Forgot password
router.post("/forgot-password", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("Email not found");
      }
      // Allows a connection to the email given
      const transporter = nodemailer.createTransport({
        host: process.env.MAILERHOST,
        port: process.env.MAILERPORT,
        auth: {
          user: process.env.MAILERUSER,
          pass: process.env.MAILERPASS,
        },
      });
      console.log(transporter);
      // How the mail should be sent out
      const mailData = {
        from: process.env.MAILUSER,
        to: result[0].email,

        subject: "Password Reset",
        html: `<div>
            <h3>Hi ${result[0].full_name},</h3>
            <br>
            <h4>Click link below to reset your password</h4>

            <a href="http://localhost:6969/new-psw.html">
              Click Here to Reset Password
              user_id = ${result[0].user_id}
            </a>

            <br>
            <p>For any queries feel free to contact us...</p>
            <div>
              Email: ${process.env.MAILERUSER}
              <br>
              Tel: If needed you can add this
            <div>
          </div>`,
      };
      // Checks if the email can be sent
      // Checks given email in the .env file
      transporter.verify((error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email valid! ", success);
        }
      });

      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.send("Please check your email");
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

// Reset password
router.put("/reset-psw/:id", (req, res) => {
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    user_id: req.params.id,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        full_name: result[0].full_name,
        email: result[0].email,
        user_type: result[0].user_type,
        phone: result[0].phone,
        country: result[0].country,
        billing_address: result[0].billing_address,
        default_shipping_address: result[0].default_shipping_address,

        // Only thing being changed
        password: hash,
      };
      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Password has been updated, please login.");
      });
    }
  });
});

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
