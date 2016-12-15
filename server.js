const express = require('express');
const Yelp = require('yelp');
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const _ = require('lodash');

const User = require("./models/User");
const Venue = require("./models/Venue");
const mongoose = require('./config/mongoose');
const setUpPassport = require("./config/setuppassport");

setUpPassport();

var yelp = new Yelp({
  consumer_key: '59WN0jygYqmEZmxF3bk3LA',
  consumer_secret: '2XepkSMNl52KMWU8tYJxWBmEAsk',
  token: 'qyD5u1DMexzeFxA6W17RDV-r_MgYggbn',
  token_secret: 'pSwE2zKFu3ERGOMSMGHwYePpgdA',
});

/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 */

var request_yelp = function(set_parameters, callback) {

  yelp.search( { location: set_parameters.location, category_filter: 'bars'} )
  .then(function (data) {
    callback(null, data);
  })
  .catch(function (err) {
    callback(err);
  });

};



var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  if(req.user){
    res.render('index', { notLogIn: false });
  }else{
    res.render('index', { notLogIn: true });
  }
})

app.get('/user', function(req, res) {
  res.render('user');
})

app.post('/yelp', function(req, res){
  var queryLocation = req.body.location;
  request_yelp({ location: queryLocation }, function(err, response){
    if(err){
      res.json({
        error: true
      })
    }else{
      Venue.find({}).then((allVenue) => {
        res.json({response: response,
                allVenue: allVenue})
      })
    }
  })
})


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/user");
  }
}

app.post("/user", function(req, res, next) {

  var displayName = req.body.displayName;
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {

    if (err) { return next(err); }
    if (user) {
      // if user exists, try to log the user in
      passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/user",
        failureFlash: true
      })
      return next();
    }

    var newUser = new User({
      displayName: displayName,
      username: username,
      password: password
    });
    newUser.save(next);

  });
}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/user",
  failureFlash: true
}));




app.post('/going', function(req, res){
  var barName = req.body.bar;
  var userName = req.user.displayName;
  // check if this guy is already marked going
  Venue.findOne({name: barName, "going.displayName": userName}).then((venue) => {
    // if venue does not exists or the name does not container in the venue
    if(venue){
      // if(venue.going.indexOf(userName) >= 0 ){
        // get index first
        var indexToRemove;
        venue.going.forEach(function(elem, index){
          if(elem.displayName == userName)
          indexToRemove = index;
        });
        console.log('the index to remove is ... ')
        console.log(indexToRemove)
        console.log(venue)
        venue.going[indexToRemove].remove();
        venue.save().then((user) => res.json(user));

    }else{
      Venue.findOne({name: barName}).then((venue) => {
        if(venue){
          venue.going.push({displayName: userName});
          venue.save()
          .then((place) => {
            console.log(place);
            res.json(place)
          })
        }else{
          var venue = new Venue({
            name: barName
          })
          venue.going.push({displayName: userName});
          venue.save()
          .then((place) => {
            console.log(place);
            res.json(place)
          })
        }
      })
    }
  })
})


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
