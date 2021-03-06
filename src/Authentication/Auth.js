import auth0 from 'auth0-js';
import history from '../history';

var URI = (window.location.host === 'localhost:3000' ? 'http://localhost:3000/callback' : 'https://shareatune.herokuapp.com/callback');

export default class Auth {

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  userProfile;

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No Access Token found');
    }
    return accessToken;
  }

  auth0 = new auth0.WebAuth({
    domain: 'augustsjogren.eu.auth0.com',
    clientID: 'VuI1SMEzCtyuhVYEygk91m3PPtwC10fL',
    redirectUri: URI,
    audience: 'https://augustsjogren.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');

        let spotifyToken = localStorage.getItem('spotify_access_token');
        let spotifyTokenExpires = localStorage.getItem('spotify_token_expires');

        if (spotifyToken && new Date().getTime() < spotifyTokenExpires) {
          window.location.reload();
        } else {
          // Get a spotify access token
          if (window.location.host === 'localhost:3000') {
            window.location = 'http://localhost:3100/api/login';
          }
          else{
            window.location = 'https://shareatune.herokuapp.com/login';
          }
        }
      } else if (err) {
        history.replace('/');
        // console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.push('/');
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.push('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    let currentTime = new Date().getTime();
    return currentTime < expiresAt;
  }

  getProfile(cb) {
  let accessToken = this.getAccessToken();
  this.auth0.client.userInfo(accessToken, (err, profile) => {
    if (profile) {
      this.userProfile = profile;
    }
    cb(err, profile);
  });
}

}
