import React from "react";
import { connect } from "react-redux";

import { fetchPosts } from '../actions/index';
import Post from './Post.js'

const mapStateToProps = state => {
  return { posts: state.posts };
};

// Fetch posts from the DB and send to store
const mapDispatchToProps = dispatch => {
  return {
    fetchPosts: url => dispatch(fetchPosts(url))
  };
};

var URI = (window.location.host == 'localhost:3000' ? "http://localhost:3100/api/posts" : "https://shareatune.herokuapp.com/api/posts");

class ConnectedList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { data: [] };
  };

  componentDidMount() {
    if (this.props.posts == "") {
      const url = URI;
      this.props.fetchPosts({url});
    }
  }

  // Update the state when the component recieves new props (posts)
  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.posts});
  }

  render(){
    var reversedArray = this.props.posts.slice().reverse();

    return(
      <ul className="list-group list-group-flush">
          {reversedArray.map(el => (
            <Post title={el.title} artist={el.artist} content={el.text} likes={el.likes}
              imageUrl={el.imageUrl} author={el.author} date={el.date} likedBy={el.likedBy}
              comments={el.comments} id={el['_id']} key={ el['_id'] }/>
          ))}
        </ul>
    );
  }
}

const List = connect(mapStateToProps, mapDispatchToProps)(ConnectedList);

export default List;
