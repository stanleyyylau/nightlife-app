var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://stanley:stanley@ds133428.mlab.com:33428/st-nightlife');

module.exports = mongoose;
