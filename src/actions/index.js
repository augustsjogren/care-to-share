import { ADD_ARTICLE } from "../constants/action-types";
import { ADD_POST } from '../constants/action-types';
import { FETCH_POSTS } from '../constants/action-types';
import { FETCH_SUCCESS } from '../constants/action-types';

import axios from 'axios';

export const addArticle = article => ({ type: ADD_ARTICLE, payload: article });

export const addPost = post => ({type: ADD_POST, payload: post});

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
          dispatch(fetchSuccess(data));
        })
    }
};
