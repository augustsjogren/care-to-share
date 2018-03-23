import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './components/Post.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CareToShare</h1>
        </header>
      <Post />
      </div>
    );
  }
}

export default App;
