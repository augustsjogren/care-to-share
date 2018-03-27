import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';


import List from './components/List.js';
import Form from './components/Form.js';
import Post from './components/Post.js';
import PostCreator from './components/PostCreator.js';

import { Navbar, NavbarBrand, NavbarNav, NavbarToggler,
  Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
      <Navbar color="indigo" dark expand="md" scrolling> 
                 <NavbarBrand href="/">
                     <strong>Care To Share</strong>
                 </NavbarBrand>


                     <NavbarNav className="ml-auto" right>
                     <NavItem active>
                         <NavLink className="nav-link" to="#profile" >Profile</NavLink>
                     </NavItem>
                         {/*<form className="form-inline">
                         <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
                         </form> */}
                     </NavbarNav>
             </Navbar>

        {/*<Form />*/}
        <PostCreator />
        <List />
      </div>
      </Router>
    );
  }
}

export default App;
