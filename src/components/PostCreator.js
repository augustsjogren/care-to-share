// @flow
import React, {Component} from 'react';
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addPost } from '../actions/index';

import {
  FormGroup,
  ControlLabel,
  FormControl,
  Grid,
  Row,
  Col,
}
  from 'react-bootstrap';

  import { Button} from 'mdbreact';

const mapDispatchToProps = dispatch => {
  return {
    addPost: post => dispatch(addPost(post))
  };
};

type Props = {
  addPost: ''
};

type State = {
  postContent: string;
}

 class ConnectedPostCreator extends Component<Props, State> {
   constructor(){
     super();
     this.state = {
       postContent: ""
     };

     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);

   }

   handleSubmit(event){
     event.preventDefault();

     const { postContent } = this.state;
     const id = uuidv1();

     this.props.addPost({ postContent, id});
     this.setState({ postContent: "" });
   }

   handleChange(event) {
     this.setState({ [event.target.id]: event.target.value });
   }


  render(){
    const {postContent} = this.state;
    return(
      // <div className="create-post-div">

      <Grid>
        <Row className="show-grid">
          <Col xs={12} sm={12} md={8} lg={8} >

          <form onSubmit={this.handleSubmit}>
            <FormGroup
            controlId="formControlsTextarea" >
             {/*<ControlLabel className="newPostLabel">New post</ControlLabel>*/}
             <FormControl
              componentClass="textarea"
              className='post-area'
              id="postContent"
              value={postContent}
              placeholder="Write a post"
              onChange={this.handleChange}
            />
            <Col xs={5} sm={5} className="buttonCol">
            <Button className="subButton" color="primary" type="submit" block> Submit </Button>
            </Col>
            </FormGroup>
          </form>


          </Col>

        </Row>

      </Grid>



      // </div>
    );
  }
}
const PostCreator = connect(null, mapDispatchToProps)(ConnectedPostCreator);
export default PostCreator;
