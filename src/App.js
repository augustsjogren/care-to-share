import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { setAccessToken, setUser } from './actions/index';
import './App.css';

import List from './components/List.js';
import PostCreator from './components/PostCreator.js';
import Feed from './components/Feed';
import Profile from './components/Profile';

import { Button, Navbar, NavbarBrand, NavbarNav,
   NavItem, NavLink} from 'mdbreact';

import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();


 const mapDispatchToProps = dispatch => {
   return {
     setAccessToken: (token) => dispatch(setAccessToken(token)),
     setUser: (user) => dispatch(setUser(user))
   };
 };

class ConnectedApp extends Component {

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  getUserInfo(){
    spotifyApi.getMe()
    .then((user) =>{
      console.log(user);
      this.props.setUser({user});
    })
    .catch((err) => {
      console.log(err);
    })
  }

  componentDidMount(){

    // If a new token has been found
    if(this.getParameterByName('access_token')){
      let token = this.getParameterByName('access_token');
      // this.props.setAccessToken({token})
      this.setSpotifyAccessToken(token, 3600000);
    }
    else {
      //console.log('No Access Token');
    }

    this.getUserInfo();

  }

  setSpotifyAccessToken(token, expires_in) {
  	localStorage.setItem('access_token', token);
  	localStorage.setItem('token_expires', (new Date()).getTime() + expires_in);
  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
      <Navbar color="blue" dark expand="md" static="true">
                 <NavbarBrand href="/">
                     <strong>Care To Share</strong>
                 </NavbarBrand>
                 <NavbarNav className="ml-auto" right>
                   <NavItem href="http://localhost:3001/api/login">
                       <a className="nav-link" href="http://localhost:3001/api/login"> Sign in </a>
                   </NavItem>
                   <NavItem >
                     <NavLink className="nav-link" to="/profile">Profile</NavLink>
                   </NavItem>
                 </NavbarNav>
             </Navbar>

             <Switch>
              <Route exact path='/' component={Feed}/>
              <Route path='/profile' component={Profile}/>
            </Switch>

      </div>
      </BrowserRouter>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);
export default App;
