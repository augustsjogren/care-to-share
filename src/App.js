import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAccessToken, setUser, fetchPosts } from './actions/index';
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
     setUser: (user) => dispatch(setUser(user)),
     fetchPosts: url => dispatch(fetchPosts(url))
   };
 };

 const mapStateToProps = state => {
   return {
     user: state.user,
     loading: state.loading
    };
 };

 const handleAuthentication = (nextState) => {
   if (/access_token|id_token|error/.test(nextState.location.hash)) {
     auth.handleAuthentication();
   }
 };

var URI = (window.location.host === 'localhost:3000' ? 'http://localhost:3100/api/posts' : 'https://shareatune.herokuapp.com/api/posts');

class ConnectedApp extends Component {

  constructor() {
    super();
    this.state = {
        collapse: false,
        isWideEnough: false,
        hasCheckedAuth: false
    };
  }

  login() {
    auth.login();
  }

  logout() {
    auth.logout();
    this.props.setUser('');
    this.forceUpdate();
  }

  // Get value from the address bar
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

    this.checkAuthentication();

    // Fetch the posts
    const url = URI;
    this.props.fetchPosts({url});

    // If a new token has been found
    if(this.getParameterByName('spotify_access_token')){
      let token = this.getParameterByName('spotify_access_token');
      this.setSpotifyAccessToken(token, 3600000);
    }
    else {
      // No spotify access token in the URL
      //console.log('No Access Token');
    }
  }

  checkAuthentication = () => {
    // If user is logged in, store the user profile in redux store
    let authenticated = auth.isAuthenticated();
    if (authenticated) {
      auth.getProfile((err, profile) => {
        if (err) {
          // console.log('Error loading the Profile', err);
          return;
        }
        this.props.setUser({profile});
        this.setState({hasCheckedAuth: true});
      });
    }
    else {
      // Not logged in;
      this.setState({hasCheckedAuth: true});
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

  renderRouter = () => {
    if (!this.props.loading && this.state.hasCheckedAuth) {
      return true;
    }
    else {
      return false;
    }
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
                { this.props.user.profile &&
                  <NavItem >
                    <NavLink className="nav-link" to="/profile">Profile</NavLink>
                  </NavItem>
                }
                { !this.props.user.profile && (
                  <NavItem >
                    <a className="nav-link" onClick={this.login.bind(this)}> Log in </a>
                  </NavItem>
                )}
                { this.props.user.profile && (
                  <NavItem >
                    <a className="nav-link" onClick={this.logout.bind(this)}> Log out </a>
                  </NavItem>
                )}

              </NavbarNav>
            </Collapse>
          </Container>
        </Navbar>

         <Alert stack={{limit: 3}} />

         {this.renderRouter() ? (
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
             ):(
               // <Callback />
               // Render empty div because it looks better than a spinner
               <div>
               </div>
             )
           }
         </div>
       </Router>
     );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);
export default App;
