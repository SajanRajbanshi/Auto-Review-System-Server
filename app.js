const express = require("express");
const app = express();
const SentimentAnalyser = require("vader-sentiment");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");

const commentsUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/comments";
const processedDataUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/ProcessedData";

const userUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/users";

const contentUri =
  "mongodb+srv://sajanrajbanshi:papjpmmw@cluster0.cazp6l4.mongodb.net/content";

const Schema = mongoose.Schema;
const contentDataSchema = new Schema({
  id: Number,
  caption: String,
  comments: Array,
});

const ProcessedDataSchema = new Schema({
  message: String,
  sentiment: Number,
  source: String,
  date: Date,
});

const userDataSchema = new Schema({
  email: String,
  username: String,
  password: String,
});

async function analyse(text) {
  return await SentimentAnalyser.SentimentIntensityAnalyzer.polarity_scores(
    text
  );
}

async function writeUserData(userInfo) {
  try {
    let status = await findUser(userInfo);
    if (status === true) {
      console.log("user already exist");
      return false;
    }
    const userDb = await mongoose.createConnection(userUri).asPromise();
    let user = userDb.model("user", userDataSchema);
    let newUser = new user(userInfo);
    await newUser.save();
    console.log("user added");
    return true;
  } catch (err) {
    console.log("error occured during writing new user", err);
  }
}

async function findUser(userInfo) {
  try {
    const userDb = await mongoose.createConnection(userUri).asPromise();
    const data = await userDb.db
      .collection("users")
      .find({ username: userInfo.username, password: userInfo.password })
      .toArray();
    console.log(data);
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("someting went wrong while searching", err);
  }
}

// the below function writes data to the processeddata database in mongodb
async function writeProcessedData(dataArray) {
  try {
    const writeDB = await mongoose
      .createConnection(processedDataUri)
      .asPromise();
    const ProcessedData = writeDB.model("processeddata", ProcessedDataSchema);
    dataArray.forEach(async (item, index) => {
      let message = item.text;
      let date = new Date(item.date);
      let source = item.source;
      let sentiment = await analyse(item.text);
      let data = new ProcessedData({
        message: message,
        sentiment: sentiment.compound,
        source: source,
        date: date,
      });
      await data.save();
      console.log("Total documents wrote:", index);
    });
  } catch (err) {
    console.log("error in writing processed data", err);
  }
}

// to read from processed data
async function readProcessedData() {
  try{
    const readDB = await mongoose.createConnection(processedDataUri).asPromise();
    const collect = readDB.db.collection("processeddatas");
    const dataArray = await collect.find({}).toArray();
    return dataArray;
  }
  catch(err)
  {
    console.log("error in reading processed data",err);
    return err;
  }
}

// to write in content database
async function writeContentData(dataArray) {
  try{
    const writeDB = await mongoose.createConnection(contentUri).asPromise();
    const contentData = writeDB.model("content", contentDataSchema);
    let count = 0;
    let included = 0;
    while (dataArray.length > 0) {
      caption = `it is the content ${count}`;
      let comments = dataArray.splice(0, 99);
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
  catch(err)
  {
    console.log("error in writing content data",err);
  }
}

// the below function is used to read data from comments database in mongodb
async function readCommentData() {
  const readDB = await mongoose.createConnection(commentsUri).asPromise();
  const collect = readDB.db.collection("comments");
  const dataArray = await collect.find().toArray();
}

app.use(cors());
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",async (req,res)=>
{ 
  try{
    res.status(200).send({status:"server is actively listening"});
  }
  catch(err)
  {
    console.log("application having issue",err);
    res.status(500).send({error:"server not active"});
  }
})

// the below api will be used for
// accessing top positive, top negatives
app.get("/api/data/:source/:sentiment/:count", async (req, res) => {
  try
  {
    let source = req.params.source;
    let sentiment = req.params.sentiment;
    let count = req.params.count;
    let dataArray = await readProcessedData();
    if (sentiment === "positive") {
      dataArray = dataArray.filter((item) => {
        return item.source === source && item.sentiment > 0;
      });
      dataArray.sort((a, b) => {
        return a.sentiment - b.sentiment;
      });
    } else {
      dataArray = dataArray.filter((item) => {
        return item.source === source && item.sentiment < 0;
      });
      dataArray.sort((a, b) => {
        return b.sentiment - a.sentiment;
      });
    }
    res.status(200).send(dataArray.slice(0, count));
  }
  catch(err)
  {
    console.log("error in api with params",err);
  }
});

// the below api will be used for line graph as
// it will require all the data to be shown when user request it all
app.get("/api/data/all", async (req, res) => {
  try {
    let dataArray = await readProcessedData();
    res.status(200).send(dataArray);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

app.post("/auth/signup", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let userInfo = { email: email, username: username, password: password };
    let status = await writeUserData(userInfo);
    if (status) {
      res.status(200).send({ status: status });
    }
  } catch (err) {
    console.log("error in signup api", err);
    res.status(400).send({ status: err });
  }
});

app.post("/auth/signin", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.headers);
    let username = req.body.username;
    let password = req.body.password;
    let userInfo = { username: username, password: password };
    let status = await findUser(userInfo);
    console.log(status);
    res.send({ status: status });
  } catch (err) {
    console.log(err);
    res.status(400).send({ status: err });
  }
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`listening in ${3000}`);
});
