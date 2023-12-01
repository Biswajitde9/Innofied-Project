import React, { useState } from 'react';
import { FaFacebookSquare, FaMapPin, FaTwitterSquare, FaInstagramSquare, FaPeopleArrows, FaUserFriends, FaUserCircle, FaUsersCog, FaUser, FaUserAlt, FaLocationArrow, FaMapMarker, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaStarHalf, FaCalendarWeek, FaCalendarCheck, FaCalendar, FaCalendarDay, FaCalendarAlt, FaCalendarTimes, FaDumpster, FaRecycle, FaEraser, FaCalendarMinus, FaWindowClose, FaRegWindowClose, FaCross, FaWindowMinimize, FaCaretSquareUp, FaAngleDoubleUp, FaPencilAlt, FaEdit, FaRegEdit, FaUserEdit, FaPen, FaAngleDoubleDown } from 'react-icons/fa';
import { FaMapMarked, FaHeart } from 'react-icons/fa';
import { db } from '../firebase-init';
import { doc, deleteDoc } from 'firebase/firestore';
import Maps from './Maps';
import Like from "./Like";
import Alert from './Alert';
import Comment from "./Comment";

const Event = ({ event, isMin, onEdit, onClose, onDelete }) => {
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

  const [showMin, setMin] = useState(isMin);
  const [showLocation, setLocation] = useState(false);
  const [showAlert, setAlert] = useState(false);

  const statusTextArray = ['PLANNED', 'DELAYED', 'STARTED', 'ENDED', 'CANCELLED'];
  const statusBgColors = [
    '#2196F3',     // Blue
    '#FFC107',     // Amber
    '#4CAF50',     // Green
    '#FF5722',       // Deep Orange
    '#F44336'    // Red
  ];
  const statusText = statusTextArray[status] || 'UNKNOWN';

  let stars = []
  for (var i = 0; i + 1 <= Math.floor(rating); i++) {
    stars.push(<FaStar key={i} className='mb-1' style={{ height: 20, width: 20, color: "gold" }}></FaStar>)
  }
  if (rating - Math.floor(rating) > 0.3) stars.push(<FaStarHalf style={{ color: "yellow" }} />)
  for (var i = 0; i + 1 <= (5 - Math.floor(rating)); i++) {
    stars.push(<FaStar key={5 + i} className='mb-1' style={{ height: 20, width: 20, color: "#aaa" }}></FaStar>)
  }


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
    <div className={`container mt-4 overflow-hidden ${showMin?"min":""}`}>
      {showLocation && <Maps latitude={location[0]} longitude={location[1]} onClose={() => setLocation(false)} />}
      {showAlert && onDelete &&
        <Alert title={"DELETE CONFIRMATION"} onAccept={() => { onDelete(); setAlert(false) }} onClose={() => setAlert(false)}
          message={<>
            Are you sure you wish to permanenty delete the event <span className="text-danger">{name}</span>?
          </>}
        />}
      <div className="row px-5 pb-5 justify-content-start" style={{ borderRadius: 8, background: `${statusBgColors[status]}22`, border: `solid 2px ${statusBgColors[status]}` }}>
        <div className="button-row mb-5 d-flex justify-content-end">
          {onEdit &&
            <button onClick={() => { onClose(); onEdit() }}
              className="btn btn-warning me-2"
              style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: 40 }}><FaPen color='white' />
            </button>
          }
          {onDelete && 
            <button onClick={() => setAlert(true)} className="me-2 btn btn-danger event-ctrl">
              <FaCalendarTimes />
            </button>
          }
          {onClose 
          ? <button onClick={onClose} className="btn btn-primary me-2 event-ctrl">
              <FaWindowClose />
            </button>
          : <button onClick={()=>setMin(!showMin)} className="btn btn-primary me-2 event-ctrl">
              {showMin ? <FaAngleDoubleUp /> : <FaAngleDoubleDown /> }
            </button>
          }
        </div>
        <div className="col-12 col-md-4" >
          <ul className="list-unstyled">
            {media_url.map((url, index) => (
              <li key={index}>
                <img src={url} style={{ borderRadius: 8, maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }} alt={`Media ${index + 1}`} className="img-fluid" />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-12 col-md-8" style={{ minHeight: 340, lineHeight: 2 }}>
          <h1 className='align-items-center'>{name} <span style={{ textWrap: "nowrap" }}>{stars}</span></h1>
          <div className='mt-2 d-flex flex-flow-column align-items-center'>
            <FaUser className="icon" style={{ color: "green" }} />
            <span style={{ weight: "500", paddingRight: "6px" }}>{attendees}</span> people attending.
          </div>
          <div className='mt-2 d-flex flex-flow-column align-items-center'>
            <FaMapMarkerAlt className="icon" style={{ color: "orange" }} onClick={() => setLocation(true)} />
            <b style={{ paddingRight: "6px" }}>Venue:</b> {address}.
          </div>
          <div className='mt-2 d-flex flex-flow-column align-items-center'>
            <FaCalendarCheck className="icon" style={{ color: "skyblue" }} /> <b style={{ paddingRight: "6px" }}>{new Date(start_date).toLocaleDateString()} - {new Date(end_date).toLocaleDateString()}</b>
          </div>
          <p style={{ lineHeight: "1.5" }} className='mt-2'>{desc}</p>

          <h3>Follow the event:</h3>
          <div className='mt-2'>
            {/* Assuming keys are "facebook", "instagram", and "twitter" */}
            <a href={social.facebook}><FaFacebookSquare style={{ background: "white", height: 40, width: 40, borderRadius: 5 }} className="me-2" /></a>
            <a href={social.twitter}><FaTwitterSquare style={{ background: "white", color: "black", height: 40, width: 40, borderRadius: 5 }} className="me-2" /></a>
            <a href={social.instagram}><FaInstagramSquare style={{ background: "white", color: "red", height: 40, width: 40, borderRadius: 5 }} className="me-2" /></a>
            <Like />
            <Comment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
