import { useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';

const ImageInput = ({ onChange, initialImage }) => {
  const [image, setImage] = useState(initialImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="position-relative" style={{ width: '60px', height: '60px' }}>
      <label htmlFor="imageInput" className="m-0 p-0">
        <img
          src={image || 'placeholder.jpg'} // Use a placeholder image or any default image
          alt={image ? 'Image Preview' : 'Upload'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        />
      </label>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      {image && (
        <div
          className="position-absolute top-0 start-0 d-flex align-items-center justify-content-center"
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
        >
          <BsPencilSquare size={20} color="#fff" />
        </div>
      )}
    </div>
  );
};

export default ImageInput;
