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
  OverlayTrigger,
  Popover
}
  from 'react-bootstrap';

import { Button, ListGroup, ListGroupItem} from 'mdbreact';
import axios from 'axios';

import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();


const mapDispatchToProps = dispatch => {
  return {
    addPost: (url, post) => dispatch(addPost(url, post))
  };
};

type Props = {
  addPost: ''
};

type State = {
  data: {
    text: string,
    author: string,
    title: string,
  },
  searchQuery: string,
  searchResult: object
};


 class ConnectedPostCreator extends Component<Props, State> {
   constructor(){
     super();
     this.state = {
       data: {
         postContent: "",
         text: "",
         title: "",
         author: "",
         _id: ""
       },
       searchQuery: "",
       searchResult: ""

     };

     this.handleChange = this.handleChange.bind(this);
     this.handleSearchChange = this.handleSearchChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleSearch = this.handleSearch.bind(this);

   }

   handleSubmit(event){
     event.preventDefault();

     const data = this.state.data;
     console.log(data);
     const url = 'http://localhost:3001/api/posts';

     this.props.addPost({url , data});
     this.setState({ postContent: "" });
   }

   handleChange(event) {
     const id = uuidv1();

     this.setState({
       data:{
         text: event.target.value,
         _id: id

       }

     });
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
  componentDidMount(){

    if(this.getParameterByName('access_token')){
      let token = this.getParameterByName('access_token');
      console.log('Token: ' + token);
      spotifyApi.setAccessToken(token);
    }
    else {
      console.log('No Access Token');
    }

  }

  handleSearchChange(event) {
    this.setState({searchQuery: event.target.value});

  }

  // Fetch tracks from spotify API based on search
  handleSearch(event){
    event.preventDefault();
    spotifyApi.searchTracks(this.state.searchQuery)
    .then((response) =>{
      this.setState({searchResult: response.tracks.items})
    })
    .catch((err) => {
      console.log(err);
    })
  }


  render(){
    const {text} = this.state.data.text;

    const content = this.state.searchResult;

    console.log(content);

    const popoverHoverFocus = (
      <Popover id="popover-trigger-hover-click" title="Popover bottom">
        <strong>Holy guacamole!</strong> Check this info.
      </Popover>
    );

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
                <Button color="primary" type="submit"> Search </Button>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <ListGroup>

                {Object.keys(content).map((item, index) =>(
                  <ListGroupItem>
                  Title: {content[item].name} <br/>
                  Artist: {content[item].artists[0].name} </ListGroupItem>
                ))}
                </ListGroup>
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
