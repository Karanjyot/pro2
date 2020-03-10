var db = require("../models");
const path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // 1. Add a join to include all of each Author's Posts
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/profile", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
  });

  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/buildquestion", function(req,res){
    res.sendFile(path.join(__dirname, "../public/buildQuestion.html"));
  });
  app.get('/getquestions', function(req,res){
    res.sendFile(path.join(__dirname,'../public/getAnswers.html'));
  })

  app.get("/chat", function(req,res){
    res.sendFile(path.join(__dirname, "../public/chat.html"));
  });
};
