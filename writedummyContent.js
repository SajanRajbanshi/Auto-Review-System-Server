const express = require("express");
const app = express();
const mongoose = require("mongoose");

const contentUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/content";
const processedContentUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/ProcessedContent";

const Schema = mongoose.Schema;
const contentSchema = new Schema({
  id: Number,
  caption: String,
  comments: Array,
  positive: Number,
  negative: Number,
  source: String,
  ratio: Number,
});

async function writeContentData(dataArray) {
  const writeDB = await mongoose
    .createConnection(processedContentUri)
    .asPromise();
  const contentData = writeDB.model("content", contentSchema);
  await dataArray.forEach(async (item) => {
    let positive_comments = item.comments.filter((comment) => {
      return comment.sentiment > 0;
    });
    let negative_comments = item.comments.filter((comment) => {
      return comment.sentiment < 0;
    });
    const newContent = new contentData({
      id: item.id,
      caption: item.caption,
      comments: item.comments,
      positive: positive_comments.length,
      negative: negative_comments.length,
      source: item.comments[0].source,
      ratio: positive_comments.length / negative_comments.length,
    });
    await newContent.save();
  });
  console.log("data wrote");
}

async function readContent() {
  const readDB = await mongoose.createConnection(contentUri).asPromise();
  const collect = readDB.db.collection("contents");
  const dataArray = await collect.find({}).toArray();
  await writeContentData(dataArray);
  console.log("write complete");
}

readContent();
