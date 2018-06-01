import React from 'react';
import { connect } from 'react-redux';
import Post from './Post.js';

const mapStateToProps = state => {
  return { posts: state.posts };
};

class ConnectedList extends React.Component {
  render(){
    const reversedArray = this.props.posts.slice().reverse();
    return(
      <ul className="list-group list-group-flush pb-3">
        {reversedArray.map(el => (
          <Post title={el.title} artist={el.artist} content={el.text} likes={el.likes}
            imageUrl={el.imageUrl} author={el.author} userID={el.userID} date={el.date} likedBy={el.likedBy}
            comments={el.comments} id={el['_id']} key={ el['_id'] }/>
        ))}
      </ul>
    );
  }
}

const List = connect(mapStateToProps, null)(ConnectedList);

export default List;
