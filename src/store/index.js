// @flow
import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index";
import thunk from 'redux-thunk';

// Load the redux browser extension
const store = createStore(
   rootReducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
 );

export default store;
