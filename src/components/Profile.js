import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import {Card} from 'mdbreact';
import axios from 'axios';

import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();

const mapStateToProps = state => {
  return {
    token: state.access_token.token,
    user: state.user
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

  render(){
    return(
      <div className="profile">
        <div className="row w-100 ">
          <Card className="profileCard mt-3 mx-auto ">
            {this.props.user &&
            <div className="row">
              <div className="col-3">
                <img src={this.props.user.profile.picture} className="img-fluid" alt=""></img>
              </div>

              <div className="col-8 py-2">

                <p>
                  <strong>User:</strong>  {this.props.user.profile.name}
                </p>
                <p>
                  <strong>Favourite genre:</strong> {this.props.user.data.favouriteGenre}
                </p>
                  </div>
                </div>
              }
              </Card>
            </div>
          </div>
        );
      }
    }

    const Profile = connect(mapStateToProps, null)(ConnectedProfile);
    export default Profile;
