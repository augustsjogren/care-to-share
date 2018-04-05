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
     this.handleLogin = this.handleLogin.bind(this);
     this.getHashParams = this.getHashParams.bind(this);

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

   getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          console.log(hashParams);
          return hashParams;
        }



   handleLogin(event){

     event.preventDefault();

     this.getHashParams();



     // const url = 'http://localhost:3001/api/login';
     //
     // axios.get(url)
     // .then(
     //   console.log('login')
     // ).catch(function (error) {
     //   console.log(error);
     // });
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

          <form onSubmit={this.handleLogin}>
            <Row>
              <Col md={12} >
              <FormControl
                placeholder="Search for a track"
                onChange={this.handleSearchChange}
              />
              </Col>
              <Col md={1} >
              <Button color="primary" href="http://localhost:3001/api/login" type="submit"> Search  </Button>
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
