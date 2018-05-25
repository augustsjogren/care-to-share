import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import PostCreator from './PostCreator';
import List from './List';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    user: state.user
   };
};

class ConnectedFeed extends Component {
  render(){
    return(
      <div className="feed">
        { this.props.user.profile &&
          <PostCreator />
        }
        <List />
      </div>
    );
  }
}

const Feed = connect(mapStateToProps, null)(ConnectedFeed);
export default Feed;
