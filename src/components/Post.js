import React, {Component} from 'react';
import {Card, Button, Fa} from 'mdbreact';
import {Row, Col} from 'react-bootstrap';
import { toggleLike } from '../actions/index';
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => {
  return {
    toggleLike: (id, userID, change, hasLiked) => dispatch(toggleLike( id, userID, change, hasLiked))
  };
};

const mapStateToProps = state => {
  return {
    user: state.user,
    posts: state.posts
   };
};

class ConnectedPost extends Component {

  handleLike = () => {
    // console.log(this.props.id);
    // console.log(this.props.posts[2].artist);

    const ID = this.props.id;

    const index = this.props.posts.findIndex(function(post){
      return post._id === ID;
    });

    // console.log(index);

    // Check if user has already liked the track

    let userID = this.props.user.profile.sub;
    userID = userID.split('|');

    let hasLiked = false;

    // console.log(this.props.posts[index].likedBy);
    // console.log(this.props.posts[index].likedBy.includes(userID[1]));
    // console.log(userID);

    if (this.props.posts[index].likedBy.includes(userID[1])) {
        hasLiked = true;
    }



    this.props.toggleLike(this.props.id, userID[1], this.props.likes, hasLiked);
  }

  render(){

    const date = new Date(this.props.date).toLocaleString('sv');

    let numberOfLikes = 0;
    if (this.props.likes) {
      numberOfLikes = this.props.likes;
    }

    return(
      <Card>

        <Row className="">
          <Col sm={3}>
            <img className="feed-img" src={this.props.imageUrl} alt="" />
          </Col>

          <Col sm={9} className="align-bottom">
            <h2>
              {this.props.title}
            </h2>

            <h5>
              {this.props.artist}
            </h5>
            <p className="pr-1">
              {this.props.content}
            </p>
            <Row className="justify-content-between bottomRow w-100 m-0">
              <Col>
                <p>
                  Posted by: {this.props.author} <br/>
                {date}
              </p>
            </Col>
            { this.props.user &&
            <Col className="float-right">
              <Button color="primary" className="" onClick={this.handleLike}><Fa icon="thumbs-o-up" /> Like ({numberOfLikes})</Button>
            </Col>
          }
          </Row>
        </Col>
      </Row>

    </Card>
  );
}
}

const Post = connect(mapStateToProps, mapDispatchToProps)(ConnectedPost);
export default Post;
