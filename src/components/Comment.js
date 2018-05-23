import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

export default class Comment extends Component {
  render(){
    return(
      <div className="comment my-3 p-2 ">
        <span style={{fontWeight: 'normal ' }}>{this.props.user} </span> <br /> <span >{this.props.content}</span>
      </div>
    );
  }
}
