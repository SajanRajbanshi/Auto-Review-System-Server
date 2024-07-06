const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ProcessedDataSchema = new Schema({
  message: String,
  sentiment: Number,
  source: String,
  date: Date,
});
module.exports = ProcessedDataSchema;
