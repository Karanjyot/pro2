const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const socket = require("socket.io");
var clients = {};
var compression = require('compression')

// Sets up the Express App
// =============================================================
var app = express();
app.use(compression());
var PORT = process.env.PORT || 8080;
// const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

//comparing login to signup

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username);
    console.log(password);
    db.User.findAll({ where: { username: username } }, function(
      err,
      results,
      fields
    ) {
      if (err) {
        done(err);
      }
      if (results.length === 0) {
        done(null, false);
      }
      return done(null, false);
    }).then(function(res) {
      console.log(res[0].dataValues.password);
      const hash = res[0].dataValues.password;
      bcrypt.compare(password, hash, function(err, response) {
        if (response === true) {
          return done(null, { annotation_id: res[0].dataValues.annotation_id });
        } else {
          return done(null, false);
        }
      });
    });
  })
);

// Routes
// =============================================================
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================

db.sequelize.sync({ force: false }).then(function() {
  var server = app.listen(PORT, function() {
    console.log(`connected to http://localhost:${PORT}`);
  });

  // Socket setup
  var io = socket(server);

  io.on("connection", function(socket) {
    console.log(`made socket connection`, socket.id);

    //listen for chat message

    socket.on("add-user", function(data) {
      clients[data.username] = {

        "socket": socket.id
      };
      console.log(clients);
    });

    // socket.on('chat', data =>{
    //     io.sockets.emit('chat', data);
    // });

    socket.on('typing', data => {

      if(clients[data.reciever] === data.reciever){
        io.sockets.connected[clients[data.reciever].socket].emit("typing", data);
      }
     
      // socket.broadcast.emit('typing', data)

    });


    socket.on('private-message', data => {
    
      if(data.to in clients && data.handle in clients){
        io.sockets.connected[clients[data.to].socket].emit("private-message", data);
        io.sockets.connected[clients[data.handle].socket].emit("private-message", data);
        
      }else if(data.handle in clients){
        io.sockets.connected[clients[data.handle].socket].emit("private-message", data);
      }else{
        io.sockets.connected[clients[data.to].socket].emit("private-message", data);
      }
   
      
    });
  });
});

// app.listen(PORT, function() {
//   console.log(`connected to http://localhost:${PORT}`);
// });
