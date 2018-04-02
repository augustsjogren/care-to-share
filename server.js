//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var bodyParser = require('body-parser');
var Post = require('./model/posts');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;


//db config
var mongoDB = 'mongodb://august:67EbGYoxX1SB@ds227199.mlab.com:27199/care-to-share';
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//adding the /posts route to our /api router
router.route('/posts')
  //retrieve all posts from the database
  .get(function(req, res) {
    //looks at our Post Schema
    Post.find(function(err, posts) {
      if (err)
        res.send(err);
      //responds with a json object of our database posts.
      res.json(posts)
    });
  })
  //post new comment to the database
  .post(function(req, res) {
    var post = new Post();
    //body parser lets us use the req.body
    post.author = req.body.author;
    post.text = req.body.text;
    post.title = req.body.title;

    post.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Post successfully added!' });
    });
  });

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
