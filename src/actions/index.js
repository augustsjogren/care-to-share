import { ADD_ARTICLE, FETCH_SUCCESS, POST_SUCCESS, SET_TOKEN, SET_USER, TOGGLE_LIKE } from '../constants/action-types';

import axios from 'axios';

export const addArticle = article => ({ type: ADD_ARTICLE, payload: article });
export const setAccessToken = token => ({ type: SET_TOKEN, payload: token });
export const setUser = user => ({ type: SET_USER, payload: user });


export function toggleLike (postID, userID, likes, likedBy){
  // Add or remove like from a specific post

  var URI = (window.location.host == 'localhost:3000' ? "http://localhost:3100/api/posts/" : "https://shareatune.herokuapp.com/api/posts");

  const urlString = 'http://localhost:3100/api/posts/' + postID;
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
  }

}

export function postSuccess (post){

  return dispatch =>{
    dispatch({type: POST_SUCCESS, payload: post});
  }
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

    })
  }
};

export function addPost(post){

  const data = post.data;

  return dispatch => {
    axios.post(post.url, {
      author: data.author,
      text: data.text,
      _id: data.id,
      title: data.title,
      artist: data.artist,
      imageUrl: data.imageUrl,
      date: data.date,
      likes: data.likes,
      likedBy: []
    })
    .then( function (response) {
      console.log(response);
      dispatch(postSuccess(data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
