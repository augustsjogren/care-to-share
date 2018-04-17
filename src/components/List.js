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

class ConnectedList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { data: [] };
  };

  componentDidMount() {
  const url = 'http://localhost:3001/api/posts';
  this.props.fetchPosts({url});
  }

  // Update the state when the component recieves new props (posts)
  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.posts});
  }

  render(){
    var reversedArray = this.state.data.slice().reverse();

    return(
      <ul className="list-group list-group-flush">
          {reversedArray.map(el => (
            <Post title={el.title} artist={el.artist} content={el.text} imageUrl={el.imageUrl} author={el.author} key={ el['_id'] }/>
          ))}
        </ul>
    );
  }
}

const List = connect(mapStateToProps, mapDispatchToProps)(ConnectedList);

export default List;
