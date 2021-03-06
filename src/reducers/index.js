import { ADD_POST, FETCH_POSTS, FETCH_SUCCESS,
  POST_SUCCESS, SET_TOKEN, SET_USER, TOGGLE_LIKE,
  ADD_COMMENT, DELETE_POST, EDIT_USERDATA, SET_LOADING } from '../constants/action-types';

// This helper will help to not mutate the state when changing sub-elements
import update from 'immutability-helper';

  const initialState = {
    posts: [],
    user: '',
    loading: true
  };

  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_POST:
      return { ...state, posts: [...state.posts, action.payload] };

      case FETCH_POSTS:
      return { ...state, posts: [...state.posts, action.payload] };

      case FETCH_SUCCESS:
      return { ...state, posts: [...state.posts, ...action.payload] };

      case SET_LOADING:
      return { ...state, loading: action.payload };

      case POST_SUCCESS:
      return { ...state, posts: [...state.posts, action.payload] };

      case TOGGLE_LIKE:
      // Find the index of the post in the posts array
      var index = state.posts.findIndex(function(post){
        return post._id === action.payload.postID;
      });
      return update(state, {
        posts: {
          [index]:{
            likes: {$set: action.payload.newLikes},
            likedBy: {$set: action.payload.likedBy}
          }
        }
      });

      case ADD_COMMENT:
      // Find the index of the post in the posts array
      index = state.posts.findIndex(function(post){
        return post._id === action.payload.postID;
      });
      return update(state, {
        posts: {
          [index]:{
            comments: {$set: action.payload.comments}
          }
        }
      });

      case DELETE_POST:
      // Filter out the posts not having the ID to remove
      var filteredPosts = state.posts.filter((item) => item._id !== action.payload.postID);
      return{...state, posts:[...filteredPosts ]};

      case SET_USER:
      var user = action.payload;
      if (user) {
        user.profile = user.profile.profile;
      }
      return { ...state, user: user};

      case EDIT_USERDATA:
      return update(state, {
        user: {
          data: {$set: action.payload.data}
        }
      });

      default:
      return state;
    }
  };

  export default rootReducer;
