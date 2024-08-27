const app=require("./server.js");

app.listen(3000, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`listening in ${3000}`);
  });