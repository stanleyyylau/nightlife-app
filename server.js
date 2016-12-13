const express = require('express');
const mongoose = require('./config/mongoose');
const passport = require('passport');

var app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  res.render('index');
})

app.get('/user', function(req, res) {
  res.render('user');
})


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
