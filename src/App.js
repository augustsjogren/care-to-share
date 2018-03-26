import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import List from './components/List.js';
import Form from './components/Form.js';
import Post from './components/Post.js';
import PostCreator from './components/PostCreator.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CareToShare</h1>
        </header>
        {/*<Form />*/}
        <List />
        <PostCreator />
      </div>
    );
  }
}

export default App;
