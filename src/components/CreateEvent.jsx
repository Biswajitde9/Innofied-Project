import { useState } from "react";
import Event from "./Event";

const CreateEvent = ({ onCreate, event, currentUser }) => {
  const [showPreview, setPreview] = useState(false);

  const [formData, setFormData] = useState(event?event:{
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
    },
  });

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

  const handleMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((url) => url.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onCreate({
      ...formData
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="mb-3">
          <button onClick={() => { setPreview(!showPreview) }} className="btn btn-primary">
            Preview Event
          </button>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            {event != null ? "Create Event" : "Update Event"}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="floating-preview bg-light p-4 rounded mt-3" style={{flexDirection:"column"}}>
          <h3>Preview:</h3>
          <Event currentUser={currentUser} event={formData} isMin={false} isPreview={true} onClose={() => setPreview(false)} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="position-relative">
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
          <input
            type="text"
            name="location"
            value={formData.location.join(", ")}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Media URLs (comma-separated):</label>
          <input
            type="text"
            name="media_url"
            value={formData.media_url.join(", ")}
            onChange={handleMediaChange}
            className="form-control"
          />
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
