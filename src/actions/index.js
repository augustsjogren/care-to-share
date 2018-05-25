import { FETCH_SUCCESS, POST_SUCCESS, SET_TOKEN, SET_USER, TOGGLE_LIKE, ADD_COMMENT, DELETE_POST } from '../constants/action-types';

import axios from 'axios';

var URI = (window.location.host == 'localhost:3000' ? 'http://localhost:3100/api/posts/' : 'https://shareatune.herokuapp.com/api/posts');

export const setAccessToken = token => ({ type: SET_TOKEN, payload: token });

export function setUser(profile){

  if (profile != '') {
    let userID = profile.profile.sub;
    userID = userID.split('|')[1];
    let urlString = 'http://localhost:3100/api/users/';

    return dispatch =>{
      // Add a user if the user doesn't exist
      let data;
      urlString = 'http://localhost:3100/api/users/' + userID;

      // Get the user data from DB
      axios.get(urlString)
      .then(function (res) {
        data = res.data;
        // Set the user in redux
        dispatch({type: SET_USER, payload: {profile, data }});
      })
      .catch(function (error) { // eslint-disable-line
        // console.log(error);
        // No user found, create one.
        urlString = 'http://localhost:3100/api/users/';
        axios.post(urlString, {
          userID: userID,
          favouriteGenre: 'Unspecified',
          userPosts: []
        })
        .then(function (response) { // eslint-disable-line
          data = {
            userID: userID,
            favouriteGenre: 'Unspecified',
            userPosts: []
          };
          dispatch({type: SET_USER, payload: {profile, data }});
        })
        .catch(function (error) { // eslint-disable-line
          // console.log(error);
          // Couldn't create user
        });

      });
    };
  }
  else {
    return dispatch => {
      dispatch({type: SET_USER, payload: {profile } });
    };
  }
}

export function toggleLike (postID, userID, likes, likedBy){
  // Add or remove like from a specific post

  const urlString = URI + postID;
  let hasLiked = false;
  let newLikes;

  if (likedBy && likedBy.includes(userID)) {
      hasLiked = true;
  }

  if (!hasLiked) {
    // Add a like

    likedBy.push(userID);

    newLikes = likes + 1;

    axios.put(urlString, {
      userID: userID,
      change: {
        likes: newLikes,
        likedBy: likedBy
      }
    });
  }
  else{
    // Remove like, user has already liked the post

    likedBy = likedBy.filter(function(item){
      return item != userID;
    });

    newLikes = likes - 1;

    axios.put(urlString, {
      userID: userID,
      change: {
        likes: newLikes,
        likedBy: likedBy
      }
    });
  }

  return dispatch =>{
    dispatch({type: TOGGLE_LIKE, payload: {postID, newLikes, userID, likedBy}});
  };

}

export function addComment(postID, comment, userID, comments){

  const urlString = URI + postID;

  try {
    comments.push(comment);
    axios.put(urlString, {
      userID: userID,
      change: {
        comments: comments
      }
    });

  } catch (e) {
    // console.log(e);
  }

  return dispatch =>{
    dispatch({type: ADD_COMMENT, payload: {postID, comments}});
  };

}

export function postSuccess (post){

  return dispatch =>{
    dispatch({type: POST_SUCCESS, payload: post});
  };
}

export function fetchSuccess(posts) {
  // Dispatch posts to database
  return dispatch => {
    dispatch({ type: FETCH_SUCCESS, payload: posts });
  };
}

export  function fetchPosts(url) {
  // API call to fetch posts from database
  return dispatch =>{
    axios.get(url.url)
    .then( function (response){
      let data = response.data;

      for (var i = 0; i < data.length; i++) {
        dispatch(fetchSuccess(data[i]));
      }

    });
  };
}

export function addPost(post){

  const data = post.data;

  return dispatch => {
    axios.post(post.url, {
      author: data.author,
      userID: data.userID,
      text: data.text,
      _id: data.id,
      title: data.title,
      artist: data.artist,
      imageUrl: data.imageUrl,
      date: data.date,
      likes: data.likes,
      likedBy: [],
      comments: []
    })
    .then( function () {
      dispatch(postSuccess(data));
    })
    .catch(function (error) { // eslint-disable-line
      // console.log(error);
    });
  };
}

export function deletePost(postID) {
  const urlString = URI + postID;

  axios.delete(urlString, {
    postID: postID
  });

  return dispatch => {
    dispatch({type: DELETE_POST, payload: {postID}});
  };

}
