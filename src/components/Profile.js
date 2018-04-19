import React, {Component} from 'react';
import { connect } from "react-redux";

import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();

const mapStateToProps = state => {
  return {
    token: state.access_token.token,
    user: state.user.user
    };
};

class ConnectedProfile extends Component {
  constructor(){
    super();
    this.state = {
      user: ""
    };
  }

  getAccessToken(){
    var expires = localStorage.getItem('token_expires', '0');
    console.log(expires);
    if ((new Date()).getTime() > expires) {
      return '';
    }
    var token = localStorage.getItem('access_token', '');
    return token;
  }

  componentDidMount(){

    let token = this.getAccessToken();

    if (token != '') {
      spotifyApi.setAccessToken(token);
    }
    else {
      console.log("Please refresh access token.");
    }

    if (this.props.user == "") {

    }

  }

  render(){
    return(
      <div>

        <div className="row">

          <div className="col-8  pt-5 m-auto">

            <div className="row">

              <div className="col-3">
                <img src={this.props.user.images[0].url} alt="Profile image not found"></img>
              </div>

              <div className="col-8">
                <p>
                  <strong>User:</strong>  <br /> {this.props.user.display_name}
                  </p>
                  <p>
                    <strong>Email:</strong> <br /> {this.props.user.email}
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
