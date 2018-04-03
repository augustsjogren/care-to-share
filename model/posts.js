var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostsSchema = new Schema({
  author: String,
  text: String,
  title: String,
  id: String
});

module.exports = mongoose.model('Post', PostsSchema);
