import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import {Card, Button} from 'mdbreact';
import { editUserData } from '../actions/index';
import ProfileField from './ProfileField';
import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();

const mapStateToProps = state => {
  return {
    token: state.access_token.token,
    user: state.user,
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editUserData: (userData) => dispatch(editUserData(userData))
  };
};

class ConnectedProfile extends Component {
  constructor(){
    super();
    this.state = {
      profile: '',
      isEditing: false,
      editedGenre: '',
      dataHasChanged: false
    };
  }

  // Fetch token from local storage
  getSpotifyAccessToken(){
    var expires = localStorage.getItem('spotify_token_expires', '0');
    if ((new Date()).getTime() > expires) {
      return '';
    }
    var token = localStorage.getItem('spotify_access_token', '');
    return token;
  }

  componentDidMount(){

    let token = this.getSpotifyAccessToken();

    if (token != '') {
      spotifyApi.setAccessToken(token);
    }
    else {
      // console.log('Please refresh access token.');
    }
  }

  // Get the post with the most likes and comments belonging
  // to the logged in user
  getPopularPost = () => {
    if (this.props.posts) {
      let userPosts = this.props.posts.filter(post => post.userID == this.props.user.data.userID);
      let largest = -1;
      let popularPost = {};

      if (userPosts.length > 0) {
        for (var post in userPosts) {
          if (userPosts[post].likes + userPosts[post].comments.length > largest) {
            popularPost = userPosts[post];
            largest = userPosts[post].likes + userPosts[post].comments.length;
          }
        }
        return popularPost.artist + ' - ' + popularPost.title;
      }
      return 'No tracks posted yet!';
    }
  }

  // Return the user's full name if logged in through google,
  // otherwise use nickname
  getUsername = () => {
    if (this.props.user.profile.sub.includes('google')) {
      return this.props.user.profile.name;
    } else {
      return this.props.user.profile.nickname;
    }
  }

  changeUserData = (data) => {
    this.props.editUserData({data});
    this.forceUpdate();
  }

  handleEditing = () => {
    if (this.state.isEditing) {
      // Save the changes and dispatch
      if(this.state.dataHasChanged){
        let data = this.props.user.data;
        data.favouriteGenre = this.state.favouriteGenre;
        this.props.editUserData({data});
        this.setState({dataHasChanged: false});
      }
    }
    else {
      // Enter edit mode
    }
    this.setState({isEditing: !this.state.isEditing});
  }

  // Callback from child components to update state
  handleFormChange = (formID, event) => {
    this.setState({dataHasChanged: true});
    let stateObj = {};
    stateObj[formID] = event.target.value;
    this.setState(stateObj);
  }

  render(){
    const editButtonText = (this.state.isEditing ? 'Save' : 'Edit Profile');
    return(
      <div className="profile w-100">
        <div className="row w-100 m-auto">
          <Card className="profileCard mt-3 mx-auto ">
            {this.props.user &&
            <div className="">
              <div className="row pt-5 imageBackground w-100 m-auto">
                <div className="col-10 m-auto">
                  <img src={this.props.user.profile.picture} className="profilePicture z-depth-3" alt=""></img>
                </div>
                <div className="row py-4 profileName m-auto">
                  <h3>{this.getUsername()}</h3>
                </div>
              </div>

              <div className="row p-3 w-100 m-auto">
                <div className="col-8 py-2">
                  <ProfileField field="Favourite genre" id="favouriteGenre" isEditable={true} handleFormChange={this.handleFormChange} isEditing={this.state.isEditing} content={this.props.user.data.favouriteGenre} />
                  <ProfileField field="Number of posts" id="numPosts" isEditable={false} handleFormChange={this.handleFormChange} isEditing={this.state.isEditing} content={this.props.user.data.userPosts} />
                  <ProfileField field="Most popular post" id="popularPost" isEditable={false} handleFormChange={this.handleFormChange} isEditing={this.state.isEditing} content={this.getPopularPost()} />
                </div>
                <div className="col-8 col-md-5 py-2 m-auto">
                  <Button className="editProfileButton postButton" onClick={this.handleEditing} color="primary" block> {editButtonText} </Button>
                </div>
              </div>
            </div>
              }
              </Card>
            </div>
          </div>
        );
      }
    }

    const Profile = connect(mapStateToProps, mapDispatchToProps)(ConnectedProfile);
    export default Profile;
