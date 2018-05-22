import { ADD_ARTICLE, ADD_POST, FETCH_POSTS, FETCH_SUCCESS, POST_SUCCESS, SET_TOKEN, SET_USER, TOGGLE_LIKE, ADD_COMMENT } from "../constants/action-types";
import update from 'immutability-helper';

const initialState = {
  posts: [],
  access_token: "",
  user: ""
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE:
      return { ...state, articles: [...state.articles, action.payload] };
    case ADD_POST:
      return { ...state, posts: [...state.posts, action.payload] };
    case FETCH_POSTS:
      return { ...state, posts: [...state.posts, action.payload] };
    case FETCH_SUCCESS:
      return { ...state, posts: [...state.posts, action.payload] };
    case POST_SUCCESS:
      return { ...state, posts: [...state.posts, action.payload] };
    case SET_TOKEN:
      return { ...state, access_token: action.payload};
    case SET_USER:
      return { ...state, user: action.payload};
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

    default:
      return state;
  }
};


export default rootReducer;
