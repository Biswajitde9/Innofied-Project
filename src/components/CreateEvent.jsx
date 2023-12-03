import { useEffect, useRef, useState } from "react";
import ImageInput from "./ImageInput";
import Event from "./Event";
import Maps from "./Maps";

const CreateEvent = ({ onCreate, event, onCache, currentUser }) => {
  const mediaRef = useRef();

  const resetForm = ()=>{
    return {
      name: "",
      desc: "",
      start_date: "",
      end_date: "",
      address: "",
      location: ["", ""],
      media_url: [],
      social: {
        facebook: "",
        twitter: "",
        instagram: "",
      }};
  };

  const [showPreview, setPreview] = useState(false);
  const [formData, setFormData] = useState(event?event:resetForm());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("social")) {
      const n = name.split(".")[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [n]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: value.split(",").map((coord) => parseFloat(coord.trim())),
    });
  };

  const handleMediaChange = (value, id) => {
    if (id >= 0 && id < formData.media_url.length) {
      formData.media_url[id] = value;
      setFormData({...formData});
    } else {
      formData.media_url.push(value);
      setFormData({...formData});
    }
  };

  const handleMediaDelete = (id) => {
    if (id >= 0 && id < formData.media_url.length) {
      formData.media_url = [...formData.media_url.slice(0, id), ...formData.media_url.slice(id + 1)];
      setFormData({...formData});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onCreate({...formData});
  };

  //giving 1 extra null item for adding new image apart from existing ones
  const imageInputs = [...formData.media_url,null].map((image, imgIndex) => (
    <ImageInput 
      key={imgIndex} 
      onChange={()=>{
        handleMediaChange(image, imgIndex)
      }} 
      onDelete={()=>{
        handleMediaDelete(imgIndex)
      }}
      initialImage={image} />
  ))

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-end">
        <button onClick={() => { setPreview(!showPreview) }} className="btn btn-primary me-3 mb-3">
          Preview Event
        </button>
        {/* <button type="submit" className="btn btn-secondary mb-3 me-3">
          {event == null ? "Create Event" : "Update Event"}
        </button> */}
        <button className="btn btn-danger mb-3 me-3" onClick={()=>setFormData(resetForm)}>
          Clear
        </button>
      </div>

      {showPreview && (
        <div className="floating-preview bg-light p-4 rounded mt-3" style={{flexDirection:"column"}}>
          <h3>Preview:</h3>
          <Event currentUser={currentUser} event={formData} isMin={false} isPreview={true} onClose={() => setPreview(false)} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="position-relative">
      <button type="submit" className="btn btn-secondary mb-3 me-3">
          {event == null ? "Create Event" : "Update Event"}
        </button>
        <div className="mb-3">
          <label className="form-label">Event Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Event Description:</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            className="form-control"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date:</label>
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date:</label>
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location:</label>
          <Maps name="location" latitude={formData.location[0]} longtude={formData.location[1]} className="form-control" isEdit={true} onClick={handleLocationChange}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Media</label>
          <input
            ref={mediaRef}
            type="text"
            name="media_url"
            value={formData.media_url.join(", ")}
            onChange={handleMediaChange}
            className="form-control"
            style={{display:"none"}}
          />
          <div className="row flex-wrap mx-2" style={{height: "100px"}}>{imageInputs}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Social Handles:</label>
          <div className="mb-3">
            <label className="form-label">Facebook:</label>
            <input
              type="text"
              name="social.facebook"
              value={formData.social.facebook}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Twitter:</label>
            <input
              type="text"
              name="social.twitter"
              value={formData.social.twitter}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Instagram:</label>
            <input
              type="text"
              name="social.instagram"
              value={formData.social.instagram}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
