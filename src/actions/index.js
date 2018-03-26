import { ADD_ARTICLE } from "../constants/action-types";
import { ADD_POST } from '../constants/action-types';

export const addArticle = article => ({ type: ADD_ARTICLE, payload: article });

export const addPost = post => ({type: ADD_POST, payload: post});
