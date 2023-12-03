import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = ({user,viewer}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...user });

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
        {user == viewer 
        ? <div className="card-header">
            <h2>{`${editedProfile.firstName} ${editedProfile.lastName}`}</h2>
            <p className="text-muted">@{editedProfile.username}</p>
            <p className="text-info">Organized {editedProfile.managed.length} events to date.</p>
            <p className="text-info">Participated in {editedProfile.attended.length} events.</p>
          </div> 
        : <div className="card-header">
            <h2>@{editedProfile.username}</h2>
            <p className="text-muted">Organized {editedProfile.managed.length} events to date.</p>
            <p className="text-muted">Participated in {editedProfile.attended.length} events.</p>
          </div>
        }
        <div className="card-body">
          <dl className="row">
            <dt className="col-sm-3">Email:</dt>
            <dd className="col-sm-9">{editedProfile.email}</dd>

            <dt className="col-sm-3">Phone:</dt>
            <dd className="col-sm-9">{editedProfile.phone}</dd>

            <dt className="col-sm-3">Address:</dt>
            <dd className="col-sm-9">{editedProfile.address}</dd>

            <dt className="col-sm-3">Organizations:</dt>
            <dd className="col-sm-9">{editedProfile.org}</dd>

            <dt className="col-sm-3">Bio:</dt>
            <dd className="col-sm-9">
              {(user == viewer && editMode) ? (
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
              {(user == viewer && editMode) ? (
                <div>
                  <input
                    type="text"
                    value={editedProfile.social.linkedin}
                    onChange={(e) => handleInputChange('social.linkedin', e.target.value)}
                    className="form-control mb-2"
                    placeholder="LinkedIn Profile"
                  />
                  <input
                    type="text"
                    value={editedProfile.social.x}
                    onChange={(e) => handleInputChange('social.x', e.target.value)}
                    className="form-control mb-2"
                    placeholder="Twitter Profile"
                  />
                  <input
                    type="text"
                    value={editedProfile.social.instagram}
                    onChange={(e) => handleInputChange('social.instagram', e.target.value)}
                    className="form-control mb-2"
                    placeholder="Instagram Profile"
                  />
                </div>
              ) : (
                <div>
                  <p>
                    <strong>LinkedIn:</strong> {editedProfile.social.linkedin}
                  </p>
                  <p>
                    <strong>Twitter:</strong> {editedProfile.social.twitter}
                  </p>
                  <p>
                    <strong>Instagram:</strong> {editedProfile.social.instagram}
                  </p>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
      
      {(user == viewer) &&
        <div className="mt-4">
          <button className={`btn ${editMode ? 'btn-success' : 'btn-primary'}`} onClick={editMode ? handleEditSave : () => setEditMode(true)}>
            {editMode ? 'Save' : 'Edit'}
          </button>
        </div>
      }
    </div>
  );
};

export default UserProfile;
