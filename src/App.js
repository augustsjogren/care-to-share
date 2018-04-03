import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import List from './components/List.js';
import PostCreator from './components/PostCreator.js';

import { Navbar, NavbarBrand, NavbarNav,
   NavItem, NavLink} from 'mdbreact';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
      <Navbar color="blue" dark expand="md" static="true">
                 <NavbarBrand href="/">
                     <strong>Care To Share</strong>
                 </NavbarBrand>
                 <NavbarNav className="ml-auto" right>
                   <NavItem active>
                       <NavLink className="nav-link" to="#profile" >Profile</NavLink>
                   </NavItem>
                 </NavbarNav>
             </Navbar>
        <PostCreator />
        <List />
      </div>
      </Router>
    );
  }
}

export default App;
