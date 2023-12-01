import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Comment = () => {
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  const handleAddComment = () => {
    if (comment.trim() !== '') {
      setCommentsList([...commentsList, comment]);
      setComment('');
    }
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
        Add
      </button>

      <div>
        <h3>Comments:</h3>
        <ul className="list-group">
          {commentsList.map((c, index) => (
            <li key={index} className="list-group-item">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comment;
