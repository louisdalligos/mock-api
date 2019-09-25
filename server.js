// CONFIG SETUP
const express = require("express");
const connectToMongoDB = require("./config/connect");
const app = express();

// CONNECT TO DB
connectToMongoDB();

// Init Middleware
app.use(express.json({ extended: false }));

// DEFINE ROUTES
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/user.route"));

const API_PORT = process.env.PORT || 8000;

//  START SERVER API
app.listen(API_PORT, () => {
  console.log(`app started at ${API_PORT}`);
});
