import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';

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
      <div>
        <div className="row w-100">
          <div className="col-8  pt-5 m-auto">
            <div className="row">
              <div className="col-3">
                <img src={this.props.user.profile.picture} className="img-fluid" alt=""></img>
              </div>

              <div className="col-8">

                <p>
                  <strong>User:</strong>  <br /> {this.props.user.profile.name}
                </p>
                <p>
                  <strong>Email:</strong> <br /> Email
                </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    const Profile = connect(mapStateToProps, null)(ConnectedProfile);
    export default Profile;
