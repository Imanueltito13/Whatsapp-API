const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Like and Subscribe");
});

app.listen(8080, () => {
  console.log("server");
});
