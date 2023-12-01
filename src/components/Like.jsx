import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LikeButton = () => {
  const [likes, setLikes] = useState(0);

  const handleLikeClick = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  return (
    <div className="mt-3">
      <button className="btn btn-primary" onClick={handleLikeClick}>
        Like {likes > 0 && `(${likes})`}
      </button>
    </div>
  );
};

export default LikeButton;
