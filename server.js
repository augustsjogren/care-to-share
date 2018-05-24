var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Post = require('./model/posts');

require('dotenv').config({path: './secrets.env'});
var cors = require('cors');

let request = require('request');
let axios = require('axios');

//Create instances
var app = express();
var router = express.Router();

app.use(cors());

var port = process.env.PORT || 3001;

//db config
var mongoDB = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@ds227199.mlab.com:27199/care-to-share';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // eslint-disable-line
db.once('open', function() {
  // we're connected!
});


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


// ----------------Spotify--------------

var os = require('os');
var hostname = os.hostname();

// Use localhost if developing
if (hostname == 'august-laptop') {
  var redirect_uri = 'http://localhost:'+port+'/api/callback'; // Your redirect uri
} else {
  redirect_uri = 'http://shareatune.herokuapp.com/callback'; // Your redirect uri
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


// Auth0 user metadata
// TODO: Make it work
router.route('/user/:id')
.post(function (req,res) {

  let url = 'https://augustsjogren.eu.auth0.com/api/v2/users/'+req.params.id;

  var tokenOptions = { method: 'post',
  url: 'https://augustsjogren.eu.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body:
   { grant_type: 'client_credentials',
     client_id: process.env.A0_CLIENT_ID,
     client_secret: process.env.A0_CLIENT_SECRET,
     audience: 'https://api.caretoshare.com' },
  json: true };

  axios(tokenOptions)
  .then(function (response) {
    // console.log('Token: ');
    // console.log(response);
  })
  .catch(function (error) {
    // console.log(error);
  });


  var options = {
    method: 'get',
    url: url,
    qs: { fields: 'user_metadata', include_fields: 'true' },
    headers:
     { 'content-type': 'application/json',
       authorization: 'Bearer '+ req.body.token } };

  axios(options)
  .then(function (response) {
    console.log(response);
    res.send(response);
  })
  .catch(function (error) {
    // console.log(error);
  });

  // console.log(res);

});



//-------------------------------------

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`); // eslint-disable-line
});
