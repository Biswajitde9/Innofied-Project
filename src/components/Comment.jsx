import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Comment = () => {
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
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
    <div className="container mt-4">
      <div className="mb-3">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
          placeholder="Type your comment..."
        />
      </div>
      <button onClick={handleAddComment} className="btn btn-primary mb-3">
        {editIndex !== null ? 'Edit' : 'Add'}
      </button>

      <div>
        <h3>Comments:</h3>
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
