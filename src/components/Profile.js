import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import {Card} from 'mdbreact';
import { editUserData } from '../actions/index';

import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();

const mapStateToProps = state => {
  return {
    token: state.access_token.token,
    user: state.user
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
      profile: ''
    };
  }

  getAccessToken(){
    var expires = localStorage.getItem('spotify_token_expires', '0');
    if ((new Date()).getTime() > expires) {
      return '';
    }
    var token = localStorage.getItem('spotify_access_token', '');
    return token;
  }

  componentDidMount(){

    let token = this.getAccessToken();

    if (token != '') {
      spotifyApi.setAccessToken(token);
    }
    else {
      // console.log('Please refresh access token.');
    }
  }

  changeUserData = () => {
    let data = this.props.user.data;
    data.favouriteGenre = 'Metal';
    this.props.editUserData({data});
    this.forceUpdate();
  }

  render(){
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
                  <h3>{this.props.user.profile.name}</h3>
                </div>
              </div>

              <div className="row p-3 w-100 m-auto">
              <div className="col-8 py-2">
                <h3 onClick={this.changeUserData}>Favourite genre:</h3>
                <p>{this.props.user.data.favouriteGenre}</p>
                <h3 onClick={this.changeUserData}>Favourite genre:</h3>
                <p>{this.props.user.data.favouriteGenre}</p>
                <h3 onClick={this.changeUserData}>Favourite genre:</h3>
                <p>{this.props.user.data.favouriteGenre}</p>
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
