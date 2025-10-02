"use strict";

const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/shopDEV";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => console.log(`Error when connecting to MongoDB`, err));

// dev
if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
