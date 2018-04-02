import { ADD_ARTICLE, ADD_POST, FETCH_POSTS, FETCH_SUCCESS } from "../constants/action-types";

const initialState = {
  articles: [],
  posts: []
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

      break;
    default:
      return state;
  }
};


export default rootReducer;
