import React, {Component} from 'react';
import {Card} from 'mdbreact';
import {Row, Col} from 'react-bootstrap';

export default class Post extends Component {

  render(){
    return(
      <Card>

        <Row>
          <Col sm={3}>
            <img className="feed-img" src={this.props.imageUrl} alt="" />
          </Col>

          <Col sm={9}>
            <h2>
              {this.props.title}
            </h2>

            <h5>
              {this.props.artist}
            </h5>
            <p>
              {this.props.content}
            </p>
            <p className="authorText">
              Posted by: {this.props.author}
            </p>
          </Col>

        </Row>


      </Card>
    );
  }
}
