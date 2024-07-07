const express = require("express");
const app = express();
const mongoose = require("mongoose");

const contentUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/content";
const processedDataUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/ProcessedData";

const Schema = mongoose.Schema;
const contentDataSchema = new Schema({
  id: Number,
  caption: String,
  comments: Array,
});

async function writeContentData(dataArray) {
  const writeDB = await mongoose.createConnection(contentUri).asPromise();
  const contentData = writeDB.model("content", contentDataSchema);
  let count = 0;
  let included = 0;
  while (dataArray.length>0) {
    caption = `it is the content ${count}`;
    let comments = dataArray.splice(0,99);
    let content = new contentData({
      id: count,
      caption: caption,
      comments: comments,
    });
    await content.save();
    console.log("data added", count);
    count += 1;
  }
  console.log("data wrote");
}

async function readProcessedData() {
  const readDB = await mongoose.createConnection(processedDataUri).asPromise();
  const collect = readDB.db.collection("processeddatas");
  const dataArray = await collect.find({}).toArray();
  dataArray.sort(()=>{return Math.random()-0.5});
  await writeContentData(dataArray);
  // console.log(dataArray);
  console.log("write complete");
}
readProcessedData();
