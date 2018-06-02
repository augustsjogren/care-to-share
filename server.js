var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Post = require('./model/posts');
var User = require('./model/users');

require('dotenv').config({path: './secrets.env'});
var cors = require('cors');

let request = require('request');

//Create instances
var app = express();
var router = express.Router();
var port = process.env.PORT || 3001;

//db config
var mongoDB = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@ds227199.mlab.com:27199/care-to-share';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // eslint-disable-line
db.once('open', function() {
  // we're connected!
});

app.use(cors());

//Configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //Remove caching so we get the most recent posts
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//Set the route path & initialize the API
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
      res.json(posts);
    });
  })
  //Add new post to the database
  .post(function(req, res) {
    var post = new Post();
    //body parser lets us use the req.body
    post.author = req.body.author;
    post.userID = req.body.userID;
    post.text = req.body.text;
    post.title = req.body.title;
    post.artist = req.body.artist;
    post.imageUrl = req.body.imageUrl;
    post.date = req.body.date;
    post.likes = req.body.likes;
    post.likedBy = [];
    post.comments = [];

    post.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Post successfully added!' });
    });
  })
  .put(function(req, res) {
    Post.findByIdAndUpdate(
      req.body.id,
      req.body.change,
      {new: true},
      (err, todo) => {
        // Handle possible database errors
        if (err) return res.status(500).send(err);
        return res.json(todo);
      }
    );
  });

  router.get('/posts/:id', function (req, res) {
    Post.findById(
      req.params.id,
      function (err, post) {
        if (err) return res.status(500).send('There was a problem finding the post.');
        if (!post) return res.status(404).send('No post found.');
        res.status(200).send(post);
    });
});
router.put('/posts/:id', function (req, res) {
    Post.findByIdAndUpdate(
      req.params.id,
      req.body.change,
      {new: true},
      function (err, post) {
        if (err) return res.status(500).send('There was a problem updating the post.');
        res.status(200).send(post);
    });
});
router.delete('/posts/:id', function (req, res) {
  Post.findByIdAndRemove(
    req.params.id,
    function (err) {
      if (err) return res.status(500).send('There was a problem deleting the post.');
      res.status(200).send();
    }
  );
});

// Get a user
router.route('/users/:id')
.get(function (req,res) {
  User.findOne({userID : req.params.id},
  function (err, user) {
    if (err) return res.status(500).send('There was a problem finding the user.');
    if (!user) return res.status(404).send('No user found.');
    res.status(200).send(user);
  });
});
// Add a user
router.route('/users')
.post(function(req, res) {
  // Is the user already in the database?
  User.count({userID: req.body.userID}, function (err, count){
    if(count == 0){
      var user = new User();
      user.userID = req.body.userID;
      user.favouriteGenre = req.body.favouriteGenre;
      user.userPosts = 0;
      user.save(function(err) {
        if (err){
          return res.status(500).send('There was a problem adding the user.');
        }
        res.json({ message: 'User successfully added!' });
      });
    }
    else {
      res.json({ message: 'User already exists.' });
    }
  });
});
router.put('/users/:id', function (req, res) {
    // CAUTION: The mongoose model for a user is not the same as the redux counterpart,
    // this is just data without personal information. The "secret" data is handled by auth0
    User.findOneAndUpdate(
      {userID : req.params.id},
      req.body.change.data,
      {new: true},
      function (err, user) {
        if (err) return res.status(500).send('There was a problem updating the user.');
        res.status(200).send(user);
    });
});

// ----------------Spotify--------------

var os = require('os');
var hostname = os.hostname();

// Use localhost if developing
if (hostname == 'august-laptop') {
  var redirect_uri = 'http://localhost:'+port+'/api/callback';
} else {
  redirect_uri = 'http://shareatune.herokuapp.com/callback';
}

router.route('/login')
.get(function(req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'client_credentials'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000';
    res.redirect(uri + '?spotify_access_token=' + access_token);
  });
});

// ----------------End of spotify--------------

//Use router configuration when we call /api
app.use('/api', router);

app.listen(port, function() {
  console.log(`api running on port ${port}`); // eslint-disable-line
});
