import React, {Component} from 'react';
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Media } from 'mdbreact';

export default class Post extends Component {

  render(){
    return(
      <Card>

        <Media>
          <Media left className="mr-3" href="#">
            <Media object src={this.props.imageUrl} alt="Generic placeholder image" />
          </Media>
          <Media body>
            <Media heading>
              {this.props.title}
            </Media>
            <h5>
              {this.props.artist}
            </h5>
            <p>
              {this.props.content}
            </p>

          </Media>
        </Media>




  </Card>
    );
  }
}
