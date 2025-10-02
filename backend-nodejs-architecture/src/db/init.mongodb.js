"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
  app,
} = require("../configs/config.mongodb");
const connectionString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  // connect function to mongodb
  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString, {
        // define the max pool size value for mongodb
        // when a request sent to db
        // -> check if the request is contained in this pool size group connections
        // -> take that and returning back
        // -> if not, create new connect to db and add that to this pool size group
        // if the current requests overload this pool size, it will need to wait for free request like queue
        // -> never this pool size will explode
        maxPoolSize: 100,
      })
      .then(() => {
        console.log("Connected to MongoDB successfully!", countConnect());
        console.log(connectionString);
      })
      .catch((err) => console.log(`Error when connecting to MongoDB`, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
