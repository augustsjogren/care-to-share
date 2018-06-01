import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import {Card, Button, Fa} from 'mdbreact';
import {Row, Col, FormGroup, FormControl} from 'react-bootstrap';
import { toggleLike, addComment, deletePost, editUserData } from '../actions/index';
import { connect } from 'react-redux';
import Comment from './Comment';
import uuidv1 from 'uuid';
import Alert from 'react-s-alert';

const mapDispatchToProps = dispatch => {
  return {
    toggleLike: (id, userID, change, likedBy) => dispatch(toggleLike( id, userID, change, likedBy)),
    addComment: (postID, comment, userID, comments) => dispatch(addComment( postID, comment, userID, comments)),
    deletePost: (postID) => dispatch(deletePost(postID)),
    editUserData: (userData) => dispatch(editUserData(userData))
  };
};

const mapStateToProps = state => {
  return {
    user: state.user,
    posts: state.posts
   };
};

class ConnectedPost extends Component {

  constructor(){
    super();
    this.state = {
      displayComments: false,
      pendingComment: ''
    };
  }

  getUserID = () => {
    if (this.props.user.profile ) {
      let userID = this.props.user.profile.sub;
      userID = userID.split('|');
      return userID[1];
    }
    else {
      return -1;
    }
  }

  handleLike = () => {
    const ID = this.props.id;
    const index = this.props.posts.findIndex(function(post){
      return post._id === ID;
    });
    this.props.toggleLike(this.props.id, this.getUserID(), this.props.likes, this.props.posts[index].likedBy);
  }

  commentClick = () => {
    this.setState({displayComments: !this.state.displayComments});
  }

  handleCommentChange = (event) => {
    this.setState({pendingComment: event.target.value });
  }

  submitComment = () => {
    if (this.state.pendingComment === '') {
      Alert.warning('Please enter a valid comment', {
              position: 'top-right',
              effect: 'scale',
              beep: false,
              timeout: 5000,
              offset: 60
          });
    }
    else {
      const ID = this.props.id;
      const index = this.props.posts.findIndex(function(post){
        return post._id === ID;
      });

      let comment = {
        content: this.state.pendingComment,
        user: this.props.user.profile.name,
        _id: uuidv1()
      };

      this.props.addComment(this.props.id, comment, this.getUserID(), this.props.posts[index].comments);
      this.setState({pendingComment: ''});

      this.refs.commentForm.reset();
    }
  }

  deletePost = () => {
    const postID = this.props.id;
    this.props.deletePost(postID);
    let data = this.props.user.data;
    data.userPosts--;
    this.props.editUserData({data});
  }

  setLikeColor = () => {
    if (!this.props.likedBy || !this.props.likedBy.includes(this.getUserID())) {
      return('primary');
    } else {
      return('success');
    }
  }

  render(){

    const date = new Date(this.props.date).toLocaleString('sv');
    const {text} = this.state.pendingComment;
    const comments = this.props.comments;

    return(
      <Card>

        <Row className="mx-0 ">
          <Col sm={3} className="pl-0">
            <img className="feed-img" src={this.props.imageUrl} alt="" />
          </Col>

          <Col sm={9} className="align-bottom pr-1 pt-2 ">
            <Row className="w-100">
              <Col sm={9}>
                <h2>
                  {this.props.title}
                </h2>
              </Col>
          </Row>

            <h5>
              {this.props.artist}
            </h5>
            <p className="pr-1">
              {this.props.content}
            </p>
            <Row className="justify-content-between bottomRow w-100 m-0 ">
              <Col>
                <p className="m-0">
                  Posted by: {this.props.author} <br/>
                {date}
              </p>
            </Col>
            { this.props.user.profile &&
            <Col className="float-right">
              { this.getUserID() === this.props.userID &&
                <Button color="deep-orange" className="removeButton postButton px-4 py-2" onClick={this.deletePost} >
                  <Fa className="fa-2x"  icon="trash-o"/>
                </Button>
              }
              <Button color="info" className="postButton px-4 py-2" onClick={this.commentClick}>
                <Fa className="fa-2x"  icon="comment-o" />
              </Button>
              <Button color={this.setLikeColor()} className="likeButton postButton px-3 py-2 d-inline-flex align-items-center" onClick={this.handleLike}>
                <Fa className="likeThumb fa-2x"  icon="thumbs-o-up" /> <span className=" pl-1 align-middle likesText ">({this.props.likes}) </span>
              </Button>
            </Col>
          }
          {!this.props.user.profile &&
            <Col className="float-right">
              <Button color="info" className="postButton px-4 py-2" onClick={this.commentClick}>
                <Fa className="fa-2x"  icon="comment-o" />
              </Button>
            <Button disabled color={this.setLikeColor()} className="likeButton postButton px-3 py-2 d-inline-flex align-items-center">
              <Fa className="likeThumb fa-2x"  icon="thumbs-o-up" /> <span className=" pl-1 align-middle likesText ">({this.props.likes}) </span>
            </Button>
          </Col>
        }
          </Row>
        </Col>
      </Row>

      {this.state.displayComments &&
      <Row className="commentRow pt-2">
        <ul className="comment-list mb-3 mt-2">
            {comments.map(el => (
              <Comment user={el.user} content={el.content} key={ el['_id'] } />
            ))}
          </ul>

          { this.props.user.profile &&

          <Row className="addCommentRow w-100 mx-auto">
            <Col sm={9}>
              <form onSubmit={this.submitComment} ref="commentForm" className='comment-area'>
                <FormGroup
                  controlId="formControlsTextarea" >
                  <FormControl
                    componentClass="textarea"
                    value={text}
                    placeholder="Write a comment"
                    onChange={this.handleCommentChange}
                    />
                </FormGroup>
              </form>
            </Col>

            <Col sm={3}>
              <Button color="light-green" className="postButton" onClick={this.submitComment}>
                <Fa className="likeThumb" /> Comment
              </Button>
            </Col>
          </Row>

        }
      </Row>
    }

    </Card>
  );
}
}

const Post = connect(mapStateToProps, mapDispatchToProps)(ConnectedPost);
export default Post;
