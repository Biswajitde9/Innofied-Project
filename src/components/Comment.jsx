import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Comment = ({data}) => {
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState(data?data:[]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddComment = () => {
    if (comment.trim() !== '') {
      if (editIndex !== null) {
        const updatedComments = [...commentsList];
        updatedComments[editIndex] = comment;
        setCommentsList(updatedComments);
        setEditIndex(null);
      } else {
        setCommentsList([...commentsList, comment]);
      }

      setComment('');
    }
  };

  const handleEditComment = (index) => {
    setComment(commentsList[index]);
    setEditIndex(index);
  };

  const handleDeleteComment = (index) => {
    const updatedComments = [...commentsList];
    updatedComments.splice(index, 1);
    setCommentsList(updatedComments);
  };

  return (
    <div className="container mt-4 ps-0">
      <div className='row'>
        <div className="col-10">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control"
            placeholder="Type your comment..."
          />
        </div>
        <div className='col-2'>
          <button onClick={handleAddComment} className="btn btn-primary mb-3">
            {editIndex !== null ? 'Edit' : 'Add'}
          </button>
        </div>
      </div>

      <div>
        {commentsList.length>0 ? <h3>Comments:</h3> : <h6>No one has commented yet! Be the first!</h6>}
        <ul className="list-group">
          {commentsList.map((c, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{c}</span>
              <div>
                <button
                  className="btn btn-warning btn-sm ml-2"
                  onClick={() => handleEditComment(index)}
                >
                  <FaEdit/>
                </button>
                <button
                  className="btn btn-danger btn-sm ml-5"
                  onClick={() => handleDeleteComment(index)}
                >
                  <MdDelete/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comment;
