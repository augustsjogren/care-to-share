import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import {Card, Button, Fa} from 'mdbreact';
import {Row, Col, FormGroup, FormControl} from 'react-bootstrap';
import { toggleLike, addComment } from '../actions/index';
import { connect } from 'react-redux';
import Comment from './Comment';
import uuidv1 from 'uuid';
import Alert from 'react-s-alert';

const mapDispatchToProps = dispatch => {
  return {
    toggleLike: (id, userID, change, likedBy) => dispatch(toggleLike( id, userID, change, likedBy)),
    addComment: (postID, comment, userID, comments) => dispatch(addComment( postID, comment, userID, comments))
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

  commentClick = () => {
    this.setState({displayComments: !this.state.displayComments});
  }

  handleCommentChange = (event) => {
    this.setState({pendingComment: event.target.value });
  }

  submitComment = () => {

    if (this.state.pendingComment == '') {
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
              <Button className="likeButton" onClick={this.commentClick}>
                <Fa className=""  icon="comment-o" />
              </Button>
              <Button color={this.setLikeColor()} className="likeButton" onClick={this.handleLike}>
                <Fa className="likeThumb"  icon="thumbs-o-up" /> <span className="align-middle">({this.props.likes}) </span>
              </Button>
            </Col>
          }
          </Row>
        </Col>
      </Row>

      {this.state.displayComments &&
      <Row className="commentRow pt-2">
        <ul className="comment-list mb-3 ">
            {comments.map(el => (
              <Comment user={el.user} content={el.content} key={ el['_id'] } />
            ))}
          </ul>

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
              <Button color="light-green" className="likeButton" onClick={this.submitComment}>
                <Fa className="likeThumb" /> Comment
              </Button>
            </Col>
          </Row>
      </Row>
    }

    </Card>
  );
}
}

const Post = connect(mapStateToProps, mapDispatchToProps)(ConnectedPost);
export default Post;
