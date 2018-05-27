import React from 'react';

export default class ProfileField extends React.Component{

  handleChange = (event) => {
    this.props.handleFormChange(this.props.id, event);
  }

  render(){
    if (this.props.isEditing && this.props.isEditable) {
      return (
        <div className="py-2">
          <h3>{this.props.field}</h3>
          <input className="form-control" onChange={(event) => this.handleChange(event) } type="text" placeholder={this.props.content} />
        </div>
      );
    } else {
      return (
        <div className="py-2">
          <h3>{this.props.field}</h3>
          <p>{this.props.content}</p>
        </div>
      );
    }

  }
}
