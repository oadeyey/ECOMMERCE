const express = require("express");
const connectDB = require("./config/db");
const UserRoute = require("./api/users");
const ProductRoute = require("./api/products");
const AdminRoute = require("./api/administrator");

const app = express();

//Connect to Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Connected successfully");
});

// Initialize BodyParser Middleware Allows us to get data in request.body
app.use(
  express.json({
    extended: false
  })
);

//Define Routes
app.use("/ecom/users", UserRoute);
app.use("/ecom/products", ProductRoute);
app.use("/ecom/administrator", AdminRoute);

// Port
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
