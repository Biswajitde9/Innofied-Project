import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserprofileData from "./userProfileData.json"
const UserProfile = () => {
    const profileData = UserprofileData.profile
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profileData });

  const handleEditSave = () => {
    // Perform save operation here (e.g., send updates to the server)
    setEditMode(false);
    // Update the original profileData with the edited data
    // For demonstration, we'll just log the edited data
    console.log('Edited Profile:', editedProfile);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>{`${editedProfile.firstName} ${editedProfile.lastName}`}</h2>
          <p className="text-muted">@{editedProfile.username}</p>
        </div>
        <div className="card-body">
          <dl className="row">
            <dt className="col-sm-3">Email:</dt>
            <dd className="col-sm-9">{editedProfile.email}</dd>

            <dt className="col-sm-3">Phone:</dt>
            <dd className="col-sm-9">{editedProfile.phone}</dd>

            <dt className="col-sm-3">Address:</dt>
            <dd className="col-sm-9">
              {`${editedProfile.address.street}, ${editedProfile.address.city}, ${editedProfile.address.state} ${editedProfile.address.zipCode}`}
            </dd>

            <dt className="col-sm-3">Company:</dt>
            <dd className="col-sm-9">{editedProfile.companyName}</dd>

            <dt className="col-sm-3">Bio:</dt>
            <dd className="col-sm-9">
              {editMode ? (
                <div className="mb-2">
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="form-control"
                  />
                </div>
              ) : (
                <p>{editedProfile.bio}</p>
              )}
            </dd>

            <dt className="col-sm-3">Social Media:</dt>
            <dd className="col-sm-9">
              {editMode ? (
                <div>
                  <input
                    type="text"
                    value={editedProfile.socialMedia.linkedin}
                    onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                    className="form-control mb-2"
                    placeholder="LinkedIn Profile"
                  />
                  <input
                    type="text"
                    value={editedProfile.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                    className="form-control mb-2"
                    placeholder="Twitter Profile"
                  />
                  <input
                    type="text"
                    value={editedProfile.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                    className="form-control mb-2"
                    placeholder="Instagram Profile"
                  />
                </div>
              ) : (
                <div>
                  <p>
                    <strong>LinkedIn:</strong> {editedProfile.socialMedia.linkedin}
                  </p>
                  <p>
                    <strong>Twitter:</strong> {editedProfile.socialMedia.twitter}
                  </p>
                  <p>
                    <strong>Instagram:</strong> {editedProfile.socialMedia.instagram}
                  </p>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>

      <div className="mt-4">
        <button className={`btn ${editMode ? 'btn-success' : 'btn-primary'}`} onClick={editMode ? handleEditSave : () => setEditMode(true)}>
          {editMode ? 'Save' : 'Edit'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
