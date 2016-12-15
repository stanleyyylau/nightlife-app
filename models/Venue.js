var mongoose = require("mongoose");
var userNameSchema = require("userName");

var venueSchema = mongoose.Schema({
  name: { type: String, required: true },
  going: [userNameSchema]
});

var Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
