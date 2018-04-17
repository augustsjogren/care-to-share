import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { setAccessToken } from './actions/index';
import './App.css';

import List from './components/List.js';
import PostCreator from './components/PostCreator.js';
import Feed from './components/Feed';

import { Button, Navbar, NavbarBrand, NavbarNav,
   NavItem, NavLink} from 'mdbreact';


 const mapDispatchToProps = dispatch => {
   return {
     setAccessToken: (token) => dispatch(setAccessToken(token))
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
  componentDidMount(){

    if(this.getParameterByName('access_token')){
      let token = this.getParameterByName('access_token');
      console.log('Token: ' + token);
      this.props.setAccessToken({token})
    }
    else {
      console.log('No Access Token');
    }

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
                   <NavItem active>
                       <a className="nav-link" href="http://localhost:3001/api/login"> Sign in </a>
                   </NavItem>
                 </NavbarNav>
             </Navbar>

             <Switch>
              <Route exact path='/' component={Feed}/>
            </Switch>

      </div>
      </BrowserRouter>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);
export default App;
