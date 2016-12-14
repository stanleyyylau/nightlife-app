var mongoose = require("mongoose");

var venueSchema = mongoose.Schema({
  name: { type: String, required: true },
  going: [{
    type: String,
    trim: true
  }]
});

var Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
