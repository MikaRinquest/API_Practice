const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const con = require("../../library/db_connection");
// const cred = require("../../config/creds");

async function login(req, res) {
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
}

async function register(req, res) {
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
      res.json(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

module.exports = {
  login,
  register,
};
