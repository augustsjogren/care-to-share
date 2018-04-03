// @flow
import React, {Component} from 'react';
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addPost } from '../actions/index';

import {
  FormGroup,
  FormControl,
  Grid,
  Row,
  Col,
}
  from 'react-bootstrap';

  import { Button} from 'mdbreact';

const mapDispatchToProps = dispatch => {
  return {
    addPost: (url, post) => dispatch(addPost(url, post))
  };
};

type Props = {
  addPost: ''
};

type State = {
  text: string;
  author: atring;
  title: string;
}

 class ConnectedPostCreator extends Component<Props, State> {
   constructor(){
     super();
     this.state = {
       postContent: "",
       text: "",
       title: "",
       author: "",
       _id: ""
     };

     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);

   }

   handleSubmit(event){
     event.preventDefault();

     const data = this.state;
     const url = 'http://localhost:3001/api/posts';

     this.props.addPost({url , data});
     this.setState({ postContent: "" });
   }

   handleChange(event) {
     const id = uuidv1();

     this.setState({
       text: event.target.value,
       _id: id

     });
   }


  render(){
    const {text} = this.state.text;
    return(
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
              value={text}
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
    );
  }
}
const PostCreator = connect(null, mapDispatchToProps)(ConnectedPostCreator);
export default PostCreator;
