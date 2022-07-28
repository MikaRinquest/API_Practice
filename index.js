const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally

const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors

app.get("/", (req, res) => {
  res.json({ Welcome: "Hello User" });
});

// Imports the userRoute
// "/users" : the extension in the url that will display the information
//  userRoute : where to pull the information
const userRoute = require("./routes/userRoute");
app.use("/users", userRoute);

// Imports the productRoute
const productRoute = require("./routes/productRoute");
app.use("/products", productRoute);

// Import the categoryRoute
const categoriesRoute = require("./routes/categoriesRoute");
app.use("/categories", categoriesRoute);

// Import the orders
const orderRoute = require("./routes/ordersRoute");
app.use("/orders", orderRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
