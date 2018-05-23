import React, {Component} from 'react';

export default class Comment extends Component {
  render(){
    return(
      <div className="comment my-3 p-2 ">
        <span style={{fontWeight: 'normal ' }}>{this.props.user} </span> <br /> <span >{this.props.content}</span>
      </div>
    );
  }
}
