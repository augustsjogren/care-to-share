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

import { Button, ListGroup, ListGroupItem, Media, Card} from 'mdbreact';
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
    artist: string,
    imageUrl: string,
    _id: string
  },
  searchQuery: string,
  searchResult: object,
  selectedItem: object,
  searchListShowing: string
};


class ConnectedPostCreator extends Component<Props, State> {
  constructor(){
    super();
    this.state = {
      data: {
        postContent: "",
        text: "",
        title: "",
        artist: "",
        author: "",
        _id: "",
        imageUrl: "",
      },
      searchQuery: "",
      searchResult: "",
      selectedItem: "",
      searchListShowing: 'none',
      selectedTrackShowing: "none"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleListClick = this.handleListClick.bind(this);

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

    try {
      const id = uuidv1();

      this.setState({
        data:{
          text: event.target.value,
          _id: id,
          title: this.state.selectedItem.name,
          artist: this.state.selectedItem.artists[0].name,
          imageUrl: this.state.selectedItem.album.images[1].url,
        }

      });
    } catch (e) {
      console.log(e);
    }
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
    this.setState({searchListShowing: 'block'});
    this.setState({searchQuery: event.target.value});
    spotifyApi.searchTracks(event.target.value)
    .then((response) =>{
      this.setState({searchResult: response.tracks.items})
    })
    .catch((err) => {
      console.log(err);
    })

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

  handleListClick(content){
    this.setState({
      selectedItem: content,
      selectedTrackShowing: 'block'
    });
    this.hideList();
  }

  hideList(){
    this.setState({searchListShowing: 'none'});
  }

  showSelectedItem = () => {
    if (this.state.selectedItem != "") {
      return <Media>
        <Media left className="mr-3">
          <Media object src={this.state.selectedItem.album.images[2].url} alt="Image not found" />
        </Media>
        <Media body>
          <Media className="selectedTrackHeading" heading>
            {this.state.selectedItem.name}
          </Media>
          {this.state.selectedItem.artists[0].name}
        </Media>
      </Media>
    } else {
      return "";
    }
  }


  render(){
    const {text} = this.state.data.text;

    const content = this.state.searchResult;

    const listStyle = {
      display: this.state.searchListShowing
    }

    const trackStyle = {
      display: this.state.selectedTrackShowing,
      margin: 10
    }

    console.log(this.state.selectedItem);

    return(
      <Grid>
        <Row className="show-grid">
          <Col xs={12} sm={12} md={8} lg={8} className="formBox" >


              <form onSubmit={this.handleSubmit}>
                <FormGroup
                  controlId="formControlsTextarea" >
                  <FormControl
                    componentClass="textarea"
                    className='post-area'
                    value={text}
                    placeholder="Write a post"
                    onChange={this.handleChange}
                    />
                </FormGroup>
              </form>

              <form onSubmit={this.handleSearch}>
                <Row>
                  <Col md={12} >
                    <FormControl
                      className="align-middle"
                      placeholder="Search for a track"
                      onChange={this.handleSearchChange}
                      />
                  </Col>

                </Row>
                <Row style={trackStyle}>
                  <Col sm={12}>
                    {this.showSelectedItem()}
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <ListGroup style={listStyle} className="w-100 mw-100">

                      {Object.keys(content).map((item, index) =>(
                        <ListGroupItem onClick={() => this.handleListClick(content[item])}>
                          <Row className="searchResultRow">

                            <Col className="searchResultItem" xs={9}>

                              <Media>
                                <Media left className="mr-3" href="#">
                                  <Media object src={content[item].album.images[2].url} alt="Image not found" />
                                </Media>
                                <Media body>
                                  <Media heading>
                                    {content[item].name}
                                  </Media>
                                  {content[item].artists[0].name}
                                </Media>
                              </Media>
                            </Col>
                          </Row>

                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>

              </form>

              <Col sm={6} xs={12} className="buttonCol w-100">
                <Button className="" onClick={this.handleSubmit} color="primary" type="submit" block> Submit </Button>
              </Col>

          </Col>
        </Row>
      </Grid>
    );
  }
}
const PostCreator = connect(null, mapDispatchToProps)(ConnectedPostCreator);
export default PostCreator;
