import { ADD_ARTICLE, ADD_POST } from "../constants/action-types";

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
    default:
      return state;
  }
};


export default rootReducer;
