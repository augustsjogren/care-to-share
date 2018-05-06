import React, {Component} from 'react';
import {Card, Button, Fa} from 'mdbreact';
import {Row, Col} from 'react-bootstrap';
import { toggleLike } from '../actions/index';
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => {
  return {
    toggleLike: (id, change) => dispatch(toggleLike( id, change))
  };
};

class ConnectedPost extends Component {

  handleLike = () => {
    console.log(this.props.id);
    this.props.toggleLike(this.props.id, this.props.likes);
  }

  render(){

    const date = new Date(this.props.date).toLocaleString('sv');

    return(
      <Card>

        <Row className="">
          <Col sm={3}>
            <img className="feed-img" src={this.props.imageUrl} alt="" />
          </Col>

          <Col sm={9} className="align-bottom">
            <h2>
              {this.props.title}
            </h2>

            <h5>
              {this.props.artist}
            </h5>
            <p className="pr-1">
              {this.props.content}
            </p>
            <Row className="justify-content-between bottomRow w-100 m-0">
              <Col>
                <p>
                  Posted by: {this.props.author} <br/>
                {date}
              </p>
            </Col>
            <Col className="float-right">
              <Button color="primary" className="" onClick={this.handleLike}><Fa icon="thumbs-o-up" /> Like ({this.props.likes})</Button>
            </Col>
          </Row>
        </Col>
      </Row>

    </Card>
  );
}
}

const Post = connect(null, mapDispatchToProps)(ConnectedPost);
export default Post;
