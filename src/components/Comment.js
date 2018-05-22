import React, {Component} from 'react';

export default class Comment extends Component {
  render(){
    return(
      <div className="comment my-3 p-2">
        <span>{this.props.user}: </span> <span>{this.props.content}</span>
      </div>
    );
  }
}
