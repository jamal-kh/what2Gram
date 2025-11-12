/**
 * @file SessionStore.js
 * @description Handles MongoDB connection and MongoStore initialization.
 */

const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");

class SessionStore {
  /**
   * @param {string} mongoURI - MongoDB connection URI
   */
  constructor(mongoURI) {
    this.mongoURI = mongoURI;
    this.store = null;
  }

  /**
   * Connects to MongoDB and creates the session store.
   */
  async init() {
    await mongoose.connect(this.mongoURI);
    this.store = new MongoStore({ mongoose });
    console.log("✅ MongoDB connected and session store ready.");
  }

  /**
   * Returns the MongoStore instance.
   * @returns {MongoStore}
   */
  getStore() {
    return this.store;
  }
}

module.exports = SessionStore;
