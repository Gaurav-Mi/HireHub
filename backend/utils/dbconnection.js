const mongoose = require("mongoose");

function connectDB(uri) {
  mongoose
    .connect(uri)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.log("Database connection failed:", error));
}

module.exports = connectDB