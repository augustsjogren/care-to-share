import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import PostCreator from './PostCreator';
import List from './List';

export default class Feed extends Component {

  render(){
    return(
      <div>
        <PostCreator />
        <List />
      </div>
    );
  }
}
