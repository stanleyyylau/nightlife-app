const express = require('express');
const mongoose = require('./config/mongoose');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

var app = express();
const port = process.env.PORT || 3000;

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.send('Hello world...');
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
