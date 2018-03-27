import React from "react";
import { connect } from "react-redux";


import Post from './Post.js'

const mapStateToProps = state => {
  return { posts: state.posts };
};

const ConnectedList = ({ posts }) => (
  <ul className="list-group list-group-flush">
    {posts.map(el => (

      <Post content={el.postContent}/>

      //
      // <li className="list-group-item" key={el.id}>
      //   {el.postContent}
      // </li>


    ))}
  </ul>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;
