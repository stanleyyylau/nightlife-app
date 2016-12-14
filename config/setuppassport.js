var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./../models/User");

module.exports = function() {

  passport.serializeUser(function(user, done) {
    // I think this mother fucking function is called by passport login strategy
    // after use is loged in...
    // it take the _id value from the user object and store it in the session
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    // this mother fucking function is called by the the middleware passport.session()
    // its solely porpose is the check the id value in the session and pass that value here
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "No user has that username!" });
      }
      user.checkPassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password." });
        }
      });
    });
  }));

};
