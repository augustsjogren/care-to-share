import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAccessToken, setUser } from './actions/index';
import './App.css';

import Feed from './components/Feed';
import Profile from './components/Profile';
import Callback from './components/Callback';

import { Navbar, NavbarBrand, NavbarNav,
   NavItem, NavLink, NavbarToggler, Collapse, Container} from 'mdbreact';

import Auth from './Authentication/Auth.js';
import history from './history.js';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

const auth = new Auth();

 const mapDispatchToProps = dispatch => {
   return {
     setAccessToken: (token) => dispatch(setAccessToken(token)),
     setUser: (user) => dispatch(setUser(user))
   };
 };

 const mapStateToProps = state => {
   return { user: state.user };
 };

 const handleAuthentication = (nextState) => {
   if (/access_token|id_token|error/.test(nextState.location.hash)) {
     auth.handleAuthentication();
   }
 };


class ConnectedApp extends Component {

  constructor() {
    super();
    this.state = {
        collapse: false,
        isWideEnough: false,
    };
  }

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  login() {
    auth.login();
  }

  logout() {
    auth.logout();
    this.props.setUser('');
    this.forceUpdate();
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  componentDidMount(){
    // If user is loged in, store the user profile in redux store
    if (auth.isAuthenticated()) {
      auth.getProfile((err, profile) => {
        if (err) {
          // console.log('Error loading the Profile', err);
          return;
        }
        this.props.setUser({profile});
      });
    }
    else {
      //console.log('Not logged in');
    }

    // If a new token has been found
    if(this.getParameterByName('spotify_access_token')){
      let token = this.getParameterByName('spotify_access_token');
      // this.props.setAccessToken({token})
      this.setSpotifyAccessToken(token, 3600000);
    }
    else {
      // No access token in the URL
      //console.log('No Access Token');
    }

  }

  setSpotifyAccessToken(token, expires_in) {
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_token_expires', (new Date()).getTime() + expires_in);
  }

  onNavMenuClick = () => {
      this.setState({
          collapse: !this.state.collapse,
      });
  }

  render() {

    return (
      <Router history={history}>
      <div className="App">
        <Navbar color="blue" dark expand="md" static="true" sticky="top">
          <Container className="py-0">
            <NavbarBrand href="/">
              <strong>Care To Share</strong>
            </NavbarBrand>
            { !this.state.isWideEnough && <NavbarToggler onClick = { this.onNavMenuClick } />}
            <Collapse isOpen = { this.state.collapse } navbar>
              <NavbarNav className="ml-auto" right>
                <NavItem >
                  <NavLink className="nav-link" to="/">Home</NavLink>
                </NavItem>
                { auth.isAuthenticated() &&
                  <NavItem >
                    <NavLink className="nav-link" to="/profile">Profile</NavLink>
                  </NavItem>
                }
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
            </Collapse>
          </Container>
        </Navbar>


             <Alert stack={{limit: 3}} />

             <Switch>
               <Route exact path='/' component={Feed}/>
               <Route path='/profile' render={(props) => {
                   return <Profile auth={auth} {...props} />;
                 }}/>
               <Route path="/callback" render={(props) => {
                   handleAuthentication(props);
                   return <Callback {...props} />;
                   }}/>
             </Switch>

      </div>
      </Router>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);
export default App;
