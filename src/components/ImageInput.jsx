import { useRef, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';

const uploadIcon = 'data:image/png;base64,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';

const ImageInput = ({ onChange, onDelete, initialImage }) => {
  const inputRef = useRef();
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
    <div className="card me-2 p-0 position-relative img-input" style={{ 
      height: "100%",
      width: 'auto',
      aspectRatio: 1,
      overflow: "clip"
    }}>
      <label htmlFor="imageInput" className="m-0 p-0">
        <img
          src={image || uploadIcon} // Use a placeholder image or any default image
          alt={image ? 'Image Preview' : 'Upload image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        />
      </label>
      <input
        ref={inputRef}
        type="file"
        id="imageInput" 
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      {image && (
        <>
          <div
            className="position-absolute top-0 start-0 d-flex align-items-center justify-content-center"
            style={{cursor: 'pointer'}}
            onClick={()=>inputRef.current.click()}
          >
            <BsPencilSquare size={20} color="black" style={{background:"white"}} />
          </div>
          <div
            className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
            style={{cursor: 'pointer'}}
            onClick={onDelete}
          >
            <MdDelete size={20} color="black" style={{background:"white"}} />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageInput;
