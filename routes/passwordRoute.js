// // Importing dependencies
// const nodemailer = require("nodemailer");
// const con = require("../library/db_connection");
// const router = require("./userRoute");
// const creds = require("../config/creds");

// router.post("/forgot-pasword", (req, res) => {
//     try {
//         let sql = "SELECT * FROM users WHERE ?"
//         let user = {
//             email: req.body.email,
//         };
//         con.query(sql, user, (err, result) => {
//             if (err) throw err;
//             if (result === 0) {
//                 res.status(400), res.send("Email not found")
//             } else {
//                 // Sllows me to connect to the given email account (my email)
//                 const transporter = nodemailer.createTransport({
//                     host: creds.
//                 })
//             }
//         })
//     }
// });

// document.ge
