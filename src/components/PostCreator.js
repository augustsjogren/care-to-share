import React, {Component} from 'react';
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addPost } from '../actions/index';

const mapDispatchToProps = dispatch => {
  return {
    addPost: post => dispatch(addPost(post))
  };
};

 class ConnectedPostCreator extends Component {
   constructor(){
     super();
     this.state = {
       postContent: ''
     };

     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);

   }

   handleSubmit(event){
     event.preventDefault();

     const { postContent } = this.state;
     const id = uuidv1();

     this.props.addPost({ postContent, id});
     this.setState({ postContent: "" });
   }

   handleChange(event) {
     this.setState({ [event.target.id]: event.target.value });
   }


  render(){
    const {postContent} = this.state;
    return(
      <div className="create-post-div">
        <form onSubmit={this.handleSubmit}>
          <label> Create post </label>
          <input type='text' className='post-area' onChange={this.handleChange}
          id="postContent"
          value={postContent}
          />
          <button type='submit'> Post </button>
        </form>
      </div>
    );
  }
}
const PostCreator = connect(null, mapDispatchToProps)(ConnectedPostCreator);
export default PostCreator;
