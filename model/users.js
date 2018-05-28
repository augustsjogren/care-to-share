var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  userID: String,
  favouriteGenre: String,
  userPosts: Number, // Should store the postIDs
});

module.exports = mongoose.model('User', UsersSchema);
