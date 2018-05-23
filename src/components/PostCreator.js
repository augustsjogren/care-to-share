// @flow
import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import uuidv1 from 'uuid';
import { addPost } from '../actions/index';
import { FormGroup, FormControl, Grid, Row, Col } from 'react-bootstrap';
import { Button, ListGroup, ListGroupItem, Media, Fa} from 'mdbreact';
import Alert from 'react-s-alert';

import SpotifyWebApi from 'spotify-web-api-js';
var spotifyApi = new SpotifyWebApi();

const mapDispatchToProps = dispatch => {
  return {
    addPost: (url, post) => dispatch(addPost(url, post))
  };
};

const mapStateToProps = state => {
  return {
    token: state.access_token.token,
    user: state.user
  };
};

var URI = (window.location.host == 'localhost:3000' ? 'http://localhost:3100/api/posts' : 'https://shareatune.herokuapp.com/api/posts');


class ConnectedPostCreator extends Component{
  constructor(){
    super();
    this.state = {
      data: {
        postContent: '',
        text: '',
        title: '',
        artist: '',
        author: '',
        _id: '',
        imageUrl: '',
        date: '',
        likes: 0,
        likedBy: [],
        comments: []
      },
      searchQuery: '',
      searchResult: '',
      selectedItem: '',
      searchListShowing: 'none',
      selectedTrackShowing: 'none',
      textInput: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleListClick = this.handleListClick.bind(this);

  }

  handleSubmit(event){
    event.preventDefault();
    if (this.state.data.text == '' || this.state.data.title == '') {
      Alert.warning('Please enter a valid post', {
              position: 'top-right',
              effect: 'scale',
              beep: false,
              timeout: 5000,
              offset: 60
          });
    } else {
      const data = this.state.data;
      const url = URI;

      this.props.addPost({url , data});
      this.setState({ postContent: '' });

      this.setState({
        selectedTrackShowing: 'none',
        data:{
          author: '',
          text: '',
          _id: '',
          title: '',
          artist: '',
          imageUrl: '',
          date: '',
          likes: 0,
          likedBy: [],
          comments: []
        }
      });

      this.refs.postContent.reset();
      this.refs.searchContent.reset();
    }
  }

  handleChange(event) {

    try {
      const id = uuidv1();

      let theDate = new Date().toJSON();

      this.setState({
        data:{
          author: this.props.user.profile.name,
          text: event.target.value,
          _id: id,
          title: this.state.selectedItem.name,
          artist: this.state.selectedItem.artists[0].name,
          imageUrl: this.state.selectedItem.album.images[1].url,
          date: theDate,
          likes: 0,
          likedBy: [],
          comments: []
        },
        textInput: event.target.value

      });
    } catch (e) {
      // console.error(e);
    }
  }

  getAccessToken(){
    var expires = localStorage.getItem('spotify_token_expires', '0');
    if ((new Date()).getTime() > expires) {
      return '';
    }
    var token = localStorage.getItem('spotify_access_token', '');
    return token;
  }

  componentDidUpdate(){

    let token = this.getAccessToken();

    if (token != '') {
      spotifyApi.setAccessToken(token);
    }
    else {
      //console.log("Please refresh access token.");
    }

  }

  componentDidMount(){
    let token = this.getAccessToken();

    if (token != '') {
      spotifyApi.setAccessToken(token);
    }
    else {
      //  console.log("Please refresh access token.");
    }
  }

  handleSearchChange(event) {
    this.setState({searchQuery: event.target.value});

    if (event.target.value.length > 0) {
      this.setState({searchListShowing: 'block'});
      spotifyApi.searchTracks(event.target.value)
      .then((response) =>{
        this.setState({searchResult: response.tracks.items});
      })
      .catch((err) => {
        console.error(err); // eslint-disable-line
      });
    }
    else {
      this.setState({
        searchListShowing: 'none',
        searchResult: []
      });
    }
  }

  // Fetch tracks from spotify API based on search
  handleSearch(event){
    event.preventDefault();
    spotifyApi.searchTracks(this.state.searchQuery)
    .then((response) =>{
      this.setState({searchResult: response.tracks.items});
    })
    .catch((err) => {
      console.error(err); // eslint-disable-line
    });
  }

  handleListClick(content){
    const id = uuidv1();
    let theDate = new Date().toJSON();

    this.setState({
      selectedItem: content,
      selectedTrackShowing: 'flex',
      data:{
        author: this.props.user.profile.name,
        _id: id,
        text: this.state.textInput,
        title: content.name,
        artist: content.artists[0].name,
        imageUrl: content.album.images[1].url,
        date: theDate,
        likes: 0,
        likedBy: [],
        comments: []
      }

    });
    this.setState({searchListShowing: 'none'});
    this.refs.searchContent.reset();
  }

  handleTrash = () => {
    this.setState({
      selectedTrackShowing: 'none',
      data:{
        author: '',
        text: '',
        _id: '',
        title: '',
        artist: '',
        imageUrl: '',
        date: '',
        likes: 0,
        likedBy: [],
        comments: []
      },
      searchResult: ''
    });
  };

  showSelectedItem = () => {
    if (this.state.selectedItem != '') {
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
      </Media> // eslint-disable-line
    } else {
      return '';
    }
  };


  render(){
    const {text} = this.state.data.text;

    const content = this.state.searchResult;

    const listStyle = {
      display: this.state.searchListShowing
    };

    const trackStyle = {
      display: this.state.selectedTrackShowing,
      margin: 10
    };

    return(
      <Grid>
        <Row className="show-grid">
          <Col xs={12} sm={12} md={8} lg={8} className="formBox" >

            <form onSubmit={this.handleSubmit} ref="postContent">
              <FormGroup
                controlId="formControlsTextarea" >
                <FormControl
                  ref="textContent"
                  componentClass="textarea"
                  className='post-area'
                  value={text}
                  placeholder="Write a post"
                  onChange={this.handleChange}
                  />
              </FormGroup>
            </form>

            <form onSubmit={this.handleSearch} ref="searchContent">
              <Row>
                <Col md={12} >
                  <FormControl
                    className="align-middle"
                    placeholder="Search for a track"
                    onChange={this.handleSearchChange}
                    />
                </Col>

              </Row>
              <Row style={trackStyle} className="pt-2">
                <Col sm={10}>
                  {this.showSelectedItem()}
                </Col>
                <Col sm={2}>
                  <Button color="deep-orange" className="likeButton" onClick={this.handleTrash}>
                    <Fa className="likeThumb"  icon="trash-o" />
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <ListGroup style={listStyle} className="w-100 mw-100">

                    {Object.keys(content).map((item) =>(
                      <ListGroupItem onClick={() => this.handleListClick(content[item])} key={uuidv1()}>
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
              <Button className="submitButton" onClick={this.handleSubmit} color="primary" type="submit" block> Submit </Button>
            </Col>

          </Col>
        </Row>
      </Grid>
    );
  }
}
const PostCreator = connect(mapStateToProps, mapDispatchToProps)(ConnectedPostCreator);
export default PostCreator;
