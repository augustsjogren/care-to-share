import { ADD_ARTICLE, ADD_POST, FETCH_POSTS, FETCH_SUCCESS, POST_SUCCESS, SET_TOKEN, SET_USER } from "../constants/action-types";

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
    default:
      return state;
  }
};


export default rootReducer;
