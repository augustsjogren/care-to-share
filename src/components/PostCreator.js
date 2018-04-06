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
import axios from 'axios';

import SpotifyWebApi from 'spotify-web-api-js';

// var spotifyApi = new SpotifyWebApi();
//
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
//   .then(function(data) {
//     console.log('Artist albums', data);
//   }, function(err) {
//     console.error(err);
//   });

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
};


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
     this.handleSearchChange = this.handleSearchChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleSearch = this.handleSearch.bind(this);

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

   handleSearchChange(event) {
     console.log('change');
   }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



   handleSearch(event){

     event.preventDefault();
     console.log('search');

     let token = this.getParameterByName('access_token');
     console.log(token);

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

          <form onSubmit={this.handleSearch}>
            <Row>
              <Col md={12} >
              <FormControl
                placeholder="Search for a track"
                onChange={this.handleSearchChange}
              />
              </Col>
              <Col md={1} >
              <Button color="primary" type="submit"> Search  </Button>
              </Col>
            </Row>
          </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}
const PostCreator = connect(null, mapDispatchToProps)(ConnectedPostCreator);
export default PostCreator;
