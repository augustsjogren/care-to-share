import React, { Component } from 'react';
import loading from '../loading.svg';

class Callback extends Component {
  render() {

    return (
      <div className="calllbackDiv">
        <img className="m-auto loadingIndicator p-5" src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
