import React, {Component} from 'react';
import { connect } from "react-redux";


export default class Post extends Component {

  render(){
    return(
      <div className="post-div">
        <h1> Title </h1>
        <p> Artist </p>
        <textarea type="text" className="commentForm" placeholder="Leave a comment" />
      </div>
    );
  }
}
