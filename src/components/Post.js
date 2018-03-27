import React, {Component} from 'react';
import { connect } from "react-redux";

import { Button, Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';


export default class Post extends Component {

  render(){
    return(
      <Card>
      <CardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20%282%29.jpg" />
      <CardBody>
          <CardTitle>Song title</CardTitle>
          <CardText>{this.props.content}</CardText>
          <Button color="red" href=""><i class="fa fa-heart-o" aria-hidden="true"></i></Button>
      </CardBody>
  </Card>
    );
  }
}
