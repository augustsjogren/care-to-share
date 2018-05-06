var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var querystring = require('querystring');

var bodyParser = require('body-parser');
var Post = require('./model/posts');

require('dotenv').config({path: './secrets.env'});
var cors = require('cors');

var axios = require('axios');
let request = require('request')

//Create instances
var app = express();
var router = express.Router();

app.use(cors());

var port = process.env.API_PORT || 3001;

const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};

//db config
var mongoDB = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@ds227199.mlab.com:27199/care-to-share';
// var mongoDB = 'mongodb://localhost/test';
// mongoose.connect(mongoDB, option)
mongoose.connect(mongoDB)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('yay');
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
      res.json(posts)
    });
  })
  //Add new post to the database
  .post(function(req, res) {
    var post = new Post();
    //body parser lets us use the req.body
    post.author = req.body.author;
    post.text = req.body.text;
    post.title = req.body.title;
    post.artist = req.body.artist;
    post.imageUrl = req.body.imageUrl;
    post.date = req.body.date;
    post.likes = req.body.likes;

    post.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Post successfully added!' });
    });
  })
  .put(function(req, res) {

    console.log(req.body);

    Post.findByIdAndUpdate(
      // the id of the item to find
      req.body.id,

      // the change to be made. Mongoose will smartly combine your existing
      // document with this change, which allows for partial updates too
      req.body.change,

      // an option that asks mongoose to return the updated version
      // of the document instead of the pre-updated one.
      {new: true},

      // the callback function
      (err, todo) => {
        // console.log(res.);
        // Handle any possible database errors
        if (err) return res.status(500).send(err);
        return res.json(todo);
      }
    )

  });





// ----------------Spotify--------------

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:3001/api/callback'; // Your redirect uri

// router.route('/login')
// .get(function(req, res) {
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: process.env.CLIENT_ID,
//       scope: 'user-read-private user-read-email',
//       redirect_uri
//     }))
// })

router.route('/login')
.get(function(req, res) {
  let code = req.query.code || null
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
  }

  console.log('posting');
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?spotify_access_token=' + access_token)
  })
})

//-------------------------------------

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
