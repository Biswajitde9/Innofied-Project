import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FcLike } from 'react-icons/fc';

const LikeButton = () => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      setLikes((prevLikes) => prevLikes + 1);
    }

    // Toggle the isLiked state
    setIsLiked((prevIsLiked) => !prevIsLiked);
  };

  return (
    <div className="mt-3">
      <button className={`btn ${isLiked ? 'btn-danger' : 'btn-primary'}`} onClick={handleLikeClick}>
        <FcLike /> {likes > 0 && `(${likes})`} {isLiked ? 'Dislike' : 'Like'}
      </button>
    </div>
  );
};

export default LikeButton;
