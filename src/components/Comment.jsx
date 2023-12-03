import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAddComment, MdComment } from "react-icons/md";
import { addComment, deleteComment, updateComment } from "./Firebase";

const Comment = ({ data, currentEvent, currentUser, style }) => {
  const [comment, setComment] = useState({});
  const [commentsList, setCommentsList] = useState(data ? data : []);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddComment = async () => {
    if (comment.message.trim() !== '') {
      if (editIndex !== null) {
        const updatedComments = [...commentsList];
        updatedComments[editIndex] = comment;
        try{
          await updateComment(comment);
          setCommentsList(updatedComments);
        } catch(e){
          console.log("error: ", e);
        }
        setEditIndex(null);
      } else {
        try{
          const newComment = { ...comment, eid: currentEvent.id, uid: currentUser.id, uname: currentUser.username};
          await addComment(newComment);
          setCommentsList([...commentsList, newComment]);
        } catch(e){
          console.log("error: ", e);
        }
      }
      setComment({});
    }
  };

  const handleEditComment = (index) => {
    setComment(commentsList[index]);
    setEditIndex(index);
  };

  const handleDeleteComment = async (index) => {
    const updatedComments = [...commentsList];
    try{
      await deleteComment(comment.id);
      updatedComments.splice(index, 1);
      setCommentsList(updatedComments);
    } catch(e){
      console.log("error: ", e);
    }
  };

  return (
    <div className="container mt-4 ps-0" style={style}>
      <div className='row'>
        <div className="col-10">
          <input
            type="text"
            value={comment.message || ''}
            onChange={(e) => setComment({ ...comment, message: e.target.value })}
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
        {commentsList.length > 0 ? <h3>Comments:</h3> : <h6>No one has commented yet! Be the first!</h6>}
        <ul className="list-group">
          {commentsList.map((c, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{`${c.username}: ${c.message}`}</span>
              <div>
                {c.uid === currentUser.id && (
                  <>
                    <button
                      className="btn btn-warning btn-sm ml-2"
                      onClick={() => handleEditComment(index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm ml-5"
                      onClick={() => handleDeleteComment(index)}
                    >
                      <MdDelete />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comment;
