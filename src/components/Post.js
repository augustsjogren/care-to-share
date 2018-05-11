import React, {Component} from 'react';
import {Card, Button, Fa} from 'mdbreact';
import {Row, Col} from 'react-bootstrap';
import { toggleLike } from '../actions/index';
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => {
  return {
    toggleLike: (id, userID, change, likedBy) => dispatch(toggleLike( id, userID, change, likedBy))
  };
};

const mapStateToProps = state => {
  return {
    user: state.user,
    posts: state.posts
   };
};

class ConnectedPost extends Component {

  getUserID = () => {
    let userID = this.props.user.profile.sub;
    userID = userID.split('|');
    return userID[1];
  }

  handleLike = () => {

    const ID = this.props.id;

    const index = this.props.posts.findIndex(function(post){
      return post._id === ID;
    });

    this.props.toggleLike(this.props.id, this.getUserID(), this.props.likes, this.props.posts[index].likedBy);
  }

  setLikeColor = () => {

    if (!this.props.likedBy.includes(this.getUserID())) {
      return('primary');
    } else {
      return('success');
    }
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
              <Button color={this.setLikeColor()} className="likeButton" onClick={this.handleLike}>
                <Fa className="likeThumb"  icon="thumbs-o-up" /> <span className="align-middle">({this.props.likes}) </span>
              </Button>
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
