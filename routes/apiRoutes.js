var db = require("../models");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
require("dotenv").config();

module.exports = function(app) {
  //   app.get("/buildquestion", authenticationMiddleware(), function(req, res) {
  //     res.sendFile(path.join(__dirname, "../public/buildQuestion.html"));
  //     console.log(req.user);
  //     console.log(req.isAuthenticated());
  //   });
  app.post("/buildquestion", function(req, res) {
    db.Question.create(req.body).then(function(dbQuestion) {
      res.json(dbQuestion);
    });

    console.log("hello");
  });
  app.get("/api/getquestions", function(req, res) {
    db.Question.findAll({
      // include: [db.User]
    }).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });
  app.post("/api/answers", function(req, res) {
    db.Answer.create({
      answer: req.body.answer
    });
  });

  app.get("/api/answers", function(req, res) {
    db.Answer.findAll({}).then(function(dbAnswers) {
      res.json(dbAnswers);
    });
  });

  app.get("/getquestions/:id", function(req, res) {
    db.Question.findOne({
      where: {
        id: req.params.id
      }
      // include: [db.User]
    }).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });

  app.post('/api/user', function(req, res) {
    console.log(req.user);
    

    db.User.findAll({
      where: {
         annotation_id: req.user.annotation_id
          
      }
    }).then(function(loggedIn){
      console.log(loggedIn[0].dataValues.firstName)
      res.end(loggedIn[0].dataValues.firstName);
       

      })
 

  })

  app.delete("/getquestions/:id", function(req, res) {
    db.Question.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbQuestion) {
      res.json(dbQuestion);
    });
  });

  app.get("/buildquestion", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/buildQuestion.html"));
    // console.log(req.user);
    // console.log(req.isAuthenticated());
  });
  app.get("/getquestions", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/getAnswers.html"));
  });
  
  app.post("/signup", function(req, res) {
    console.log(req.body);

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      db.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        userName: req.body.userName,
        password: hash
      }).then(function(response) {
        const user_id = response.annotation_id;

        console.log(user_id);
        req.login(user_id, function(err) {
          res.redirect("/buildquestion");
        });
      });
    });
  });

  //authentication request
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/buildquestion",
      failureRedirect: "/login"
    })
  );
  app.get("/logout", function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  });

  passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  //API Route for ask question
  app.get("/api/buildquestion", function(req, res) {
    res.sendFile("../public/buildQuestion.html");
  });

  // post request to add chat information to chats table in database
  app.post("/api/post", function(req, res) {
    console.log(req.body);
    db.Chat.create({
      sender: req.body.sender,
      reciever: req.body.reciever,
      chats: req.body.chat
    }).then(function(dbUser) {});
  });


// post request for retrieving chats between 2 users 
app.post("/api/chats", function (req, res) {
    var chatsArr = []

  

    db.sequelize.query("SELECT * FROM Chats WHERE (sender = '" + req.body.sender + "' AND reciever = '" + req.body.reciever + "') OR (sender = '" + req.body.reciever + "' AND reciever = '" + req.body.sender + "')"
      
    ,{ type: db.Sequelize.QueryTypes.SELECT }).then(function(dbChat){
      
      // for (var i = 0; i < dbChat.length; i++) {
      //               chatsArr.push(dbChat[i])
      //           }
      //           console.log(chatsArr)
      console.log(dbChat)
                res.end(JSON.stringify(dbChat));
    });


    // db.Chat.findAll({
    //     where: {
    //         reciever: req.body.reciever,
    //         sender: req.body.sender, 
    //         // $or: [{reciever: req.body.reciever, sender: req.body.sender}, {reciever: req.body.sender,
    //         //   sender: req.body.reciever}] 


              

            
    //     }
    // })
    //     .then(function (dbChat) {
    //         for (var i = 0; i < dbChat.length; i++) {
    //             chatsArr.push(dbChat[i])
    //         }
    //         res.end(JSON.stringify(chatsArr));
    //     });
});

  // post request for creating an array of users that we can use for the chat
  app.post("/api/users", function(req, res) {
    var arr = [];
    db.User.findAll().then(function(dbUser) {
      for (var i = 0; i < dbUser.length; i++) {
        arr.push(dbUser[i].firstName);
      }
      res.end(JSON.stringify(arr));
      console.log(arr);
    });
  });



};

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});
function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
    );

    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  };
}
