import React, {Component} from 'react';
import { connect } from "react-redux";

import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();

const mapStateToProps = state => {
  return { token: state.access_token.token };
};

class ConnectedProfile extends Component {

  render(){
    return(
      <div>
        <p>
          
        </p>
      </div>
    );
  }
}

const Profile = connect(mapStateToProps, null)(ConnectedProfile);
export default Profile;
