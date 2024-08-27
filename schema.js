const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ProcessedDataSchema = new Schema({
  message: String,
  sentiment: Number,
  source: String,
  date: Date,
});

const contentDataSchema = new Schema({
  id: Number,
  caption: String,
  comments: Array,
});

const userDataSchema = new Schema({
  email: String,
  username: String,
  password: String,
});

const contentSchema = new Schema({
  id: Number,
  caption: String,
  comments: Array,
  positive: Number,
  negative: Number,
  source: String,
  ratio: Number,
});



module.exports = {ProcessedDataSchema,contentDataSchema,userDataSchema,contentSchema};
