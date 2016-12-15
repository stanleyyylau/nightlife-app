var mongoose = require("mongoose");

var userNameSchema = mongoose.Schema({
  displayName: String
});

module.exports = userNameSchema;
