import React from 'react';

export default class ProfileField extends React.Component{

  constructor(){
    super();
    this.state = {
      fieldValue: ''
    };
  }

  componentDidMount(){
    this.setState({fieldValue: this.props.content});
  }

  handleChange = (event) => {
    this.setState({fieldValue: event.target.value});
    this.props.handleFormChange(this.props.id, event);
  }

  render(){
    if (this.props.isEditing && this.props.isEditable) {
      return (
        <div className="py-2">
          <h3>{this.props.field}</h3>
          <input className="form-control" onChange={(event) => this.handleChange(event)} type="text" value={this.state.fieldValue} />
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
