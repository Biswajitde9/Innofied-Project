import React, { useState } from 'react';
import { FaFacebookSquare, FaMapPin, FaTwitterSquare, FaInstagramSquare, FaPeopleArrows, FaUserFriends, FaUserCircle, FaUsersCog, FaUser, FaUserAlt, FaLocationArrow, FaMapMarker, FaMapMarkerAlt } from 'react-icons/fa';
import { FaMapMarked } from 'react-icons/fa';
import { db } from '../firebase-init';
import { doc, deleteDoc } from 'firebase/firestore';
import Maps from './Maps';
import Like from "./Like";
import Comment from "./Comment";
const Event = ({ event, onDelete }) => {
  console.log(event);
  const {
    name,
    desc,
    start_date,
    end_date,
    address,
    location,
    media_url,
    attendees,
    rating,
    social,
    status,
  } = event;

  const [showLocation,setLocation] = useState(false);
  const statusTextArray = ['PLANNED', 'DELAYED', 'STARTED', 'ENDED', 'CANCELLED'];
  const statusBgColors = [
    '#2196F3',     // Blue
    '#FFC107',     // Amber
    '#4CAF50',     // Green
    '#FF5722',       // Deep Orange
    '#F44336'    // Red
  ];
  const statusText = (statusTextArray[status] != null) || 'UNKNOWN';

  // const handleDelete = async () => {
  //   try {
  //     // Delete the event from the database
  //     const eventDocRef = doc(db, 'Events', event.uid);
  //     await deleteDoc(eventDocRef);

  //     // Trigger the onDelete callback to update the state in the parent component
  //     onDelete(event.uid);
  //   } catch (error) {
  //     console.error('Error deleting event:', error);
  //     // Handle error
  //   }
  // };

  return (
    <div className="container mt-4">
      {showLocation && <Maps latitude={location[0]} longitude={location[1]} onClose={()=>setLocation(false)}/>}
      <div className="row px-5 pb-5 justify-content-start" style={{borderRadius:8,background:`${statusBgColors[status]}22`, border:`solid 2px ${statusBgColors[status]}`}}>
        <div className="button-row mb-5 d-flex justify-content-end">
          <button onClick={()=>onDelete(event.id)} className="btn btn-danger" style={{borderTopLeftRadius:0,borderTopRightRadius:0,width:40}}>x</button>
        </div>

        <div className="col-12 col-md-4" >
          <ul className="list-unstyled">
            {media_url.map((url, index) => (
              <li key={index}>
                <img src={url} style={{borderRadius:8, maxHeight:"100%",maxWidth:"100%",objectFit:"cover"}} alt={`Media ${index + 1}`} className="img-fluid" />
              </li>
            ))}
            <Like/>
            <Comment/>
          </ul>
        </div>

        <div className="col-12 col-md-8" style={{minHeight:340}}>
          <h2>{name}</h2>
          <p>From {new Date(start_date).toLocaleDateString()} to {new Date(end_date).toLocaleDateString()}</p>
          <p>{desc}</p>
          <p><FaMapMarkerAlt style={{color:"orange",height:38,width:38,borderRadius:5}} onClick={()=>setLocation(true)}/><strong>Venue:</strong> {address}.</p>
          <span>
          <strong>Status:</strong> {statusText}
          </span>
          <span><strong>Rating:</strong> {rating}</span>
          <span><strong>Attendees:</strong> {attendees}</span>
          <div className='mt-2 d-flex flex-flow-column'>
            <FaUser style={{border:"solid white 2px",color:"green", background:"lightgreen",height:40,width:40,borderRadius:5}} className="me-2"/>
            {}
          </div>
          <div className='mt-2'>
            {/* Assuming keys are "facebook", "instagram", and "twitter" */}
            <a href={social.facebook}><FaFacebookSquare style={{background:"white",height:40,width:40,borderRadius:5}} className="me-2"/></a>
            <a href={social.twitter}><FaTwitterSquare style={{background:"white",color:"black",height:40,width:40,borderRadius:5}} className="me-2"/></a>
            <a href={social.instagram}><FaInstagramSquare  style={{background:"white", color:"red",height:40,width:40,borderRadius:5}} className="me-2"/></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
