import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { setAccessToken, setUser } from './actions/index';
import './App.css';

import List from './components/List.js';
import PostCreator from './components/PostCreator.js';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Callback from './components/Callback';

import { Button, Navbar, NavbarBrand, NavbarNav,
   NavItem, NavLink} from 'mdbreact';

import SpotifyWebApi from 'spotify-web-api-js';

import Auth from './Authentication/Auth.js';
import history from './history.js'

const auth = new Auth();

var spotifyApi = new SpotifyWebApi();


 const mapDispatchToProps = dispatch => {
   return {
     setAccessToken: (token) => dispatch(setAccessToken(token)),
     setUser: (user) => dispatch(setUser(user))
   };
 };

 const handleAuthentication = (nextState, replace) => {
   if (/access_token|id_token|error/.test(nextState.location.hash)) {
     auth.handleAuthentication();
   }
 }


class ConnectedApp extends Component {

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    auth.login();
  }

  logout() {
  auth.logout();
  this.forceUpdate();
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

  getUserInfo(){
    spotifyApi.getMe()
    .then((user) =>{
    //  console.log(user);
      this.props.setUser({user});
    })
    .catch((err) => {
      console.log(err);
    })
  }

  componentDidMount(){

    // If a new token has been found
    if(this.getParameterByName('spotify_access_token')){
      let token = this.getParameterByName('spotify_access_token');
      // this.props.setAccessToken({token})
      this.setSpotifyAccessToken(token, 3600000);
    }
    else {
      //console.log('No Access Token');
    }

    this.getUserInfo();

  }

  setSpotifyAccessToken(token, expires_in) {
    console.log('öj');
  	localStorage.setItem('spotify_access_token', token);
  	localStorage.setItem('spotify_token_expires', (new Date()).getTime() + expires_in);
  }


  render() {

    const { isAuthenticated } = auth;

    return (
      <Router history={history}>
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

                   { !auth.isAuthenticated() && (
                       <NavItem >
                         <a className="nav-link" onClick={this.login.bind(this)}> Log in </a>
                       </NavItem>
                     )}
                   { auth.isAuthenticated() && (
                       <NavItem >
                         <a className="nav-link" onClick={this.logout.bind(this)}> Log out </a>
                       </NavItem>
                     )}

                 </NavbarNav>
             </Navbar>

             <Switch>
               <Route exact path='/' component={Feed}/>
               <Route path='/profile' render={(props) => {
                   return <Profile auth={auth} {...props} />
                 }}/>
               <Route path="/callback" render={(props) => {
                   handleAuthentication(props);
                   return <Callback {...props} />
                   }}/>
             </Switch>

      </div>
      </Router>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);
export default App;
