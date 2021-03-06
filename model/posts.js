var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostsSchema = new Schema({
  author: String,
  userID: String,
  text: String,
  title: String,
  artist: String,
  imageUrl: String,
  id: String,
  date: Object,
  likes: Number,
  likedBy: [],
  comments: []
});

module.exports = mongoose.model('Post', PostsSchema);
