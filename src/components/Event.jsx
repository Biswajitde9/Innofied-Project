import { useRef, useState } from 'react';
import { FaFacebookSquare, FaMapPin, FaTwitterSquare, FaInstagramSquare, FaPeopleArrows, FaUserFriends, FaUserCircle, FaUsersCog, FaUser, FaUserAlt, FaLocationArrow, FaMapMarker, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaStarHalf, FaCalendarWeek, FaCalendarCheck, FaCalendar, FaCalendarDay, FaCalendarAlt, FaCalendarTimes, FaDumpster, FaRecycle, FaEraser, FaCalendarMinus, FaWindowClose, FaRegWindowClose, FaCross, FaWindowMinimize, FaCaretSquareUp, FaAngleDoubleUp, FaPencilAlt, FaEdit, FaRegEdit, FaUserEdit, FaPen, FaAngleDoubleDown } from 'react-icons/fa';
import { FaMapMarked, FaHeart } from 'react-icons/fa';
import Maps from './Maps';
import Comment from "./Comment";
import { MdDelete } from "react-icons/md";
import { addEventLike } from "./Firebase";

export const StatusTextArray = ['PLANNED', 'DELAYED', 'STARTED', 'ENDED', 'CANCELLED'];
export const StatusBgColors = [
  '#2196F3',     // Blue
  '#FFC107',     // Amber
  '#4CAF50',     // Green
  '#FF5722',       // Deep Orange
  '#F44336'    // Red
];

const Event = ({ currentUser, event, onEdit, onClose, onDelete, isMin = false, isPreview = false, style = {} }) => {
  const selfRef = useRef();
  const [cache,setCache] = useState(event?event:{
    name:"",
    desc:"",
    start_date:null,
    end_date:null,
    address:"",
    location:"",
    media_url:[],
    attendees:[],
    rating:null,
    social:{},
    status:"",
    comments:[]
  });

  const [likes, setLikes] = useState(cache.rating ? cache.rating.length : 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      setLikes((prevLikes) => prevLikes + 1);
    }
    
    // Toggle the isLiked state
    setIsLiked((prevIsLiked) => !prevIsLiked);
    addEventLike(cache.id,currentUser.id);
  };

  const [showMin, setMin] = useState(isMin);
  const [showLocation, setLocation] = useState(false);

  const statusText = StatusTextArray[cache.status] || 'UNKNOWN';

  // let stars = []
  // for (var i = 0; i + 1 <= Math.floor(rating); i++) {
  //   stars.push(<FaStar key={i} className='mb-1' style={{ height: 20, width: 20, color: "gold" }}></FaStar>)
  // }
  // if (rating - Math.floor(rating) > 0.3) stars.push(<FaStarHalf style={{ color: "yellow" }} />)
  // for (var i = 0; i + 1 <= (5 - Math.floor(rating)); i++) {
  //   stars.push(<FaStar key={5 + i} className='mb-1' style={{ height: 20, width: 20, color: "#aaa" }}></FaStar>)
  // }


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
    <div id={cache.id} ref={selfRef} className={`container my-3 overflow-hidden ${showMin ? "min" : "max"}`} style={style}>
      {showLocation && 
        <div className='floating-preview'>
          <Maps latitude={cache.location[0]} longitude={cache.location[1]} onClose={() => setLocation(false)} />
        </div>
      }

      <div
        className={`row ${showMin ? "w-100 justify-content-between" : "py-2 justify-content-start"}`}
        style={{ borderRadius: 8, background: `${StatusBgColors[cache.status]}22`, border: `solid 2px ${StatusBgColors[cache.status]}` }}
      >

        {!showMin &&
          <div className="button-row-ctr d-flex justify-content-end" >
            <div className="button-row mb-5 d-flex align-items-top position-absolute" style={{ transform: "rotateZ(180)", marginTop: "-8px" }}>
              {onClose
                ? <button onClick={onClose} className="btn btn-primary me-2 event-ctrl">
                  <FaWindowClose />
                </button>
                : <button onClick={() => setMin(true)} className="btn btn-primary me-2 event-ctrl">
                  <FaAngleDoubleDown style={{ rotate: "180deg" }} />
                </button>
              }
              {onDelete &&
                <button onClick={onDelete} className="me-2 btn btn-danger event-ctrl">
                  <MdDelete />
                </button>
              }
              {onEdit &&
                <button onClick={onEdit} className="btn btn-warning me-2 event-ctrl" ><FaPen color='white' />
                </button>
              }
            </div>
          </div>
        }


        <div className={`event-image d-flex align-items-top mt-5 ${showMin ? "col-1" : "col-12 col-md-4"}`} >
          <ul className="list-unstyled">
            {cache.media_url.map((url, index) => (
              <li key={index}>
                <img src={url} 
                  style={{ borderRadius: 8, maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }} 
                  alt={`Media ${index + 1}`} 
                  className="img-fluid" />
              </li>
            ))}
          </ul>
        </div>

        <div className={`event-details ${showMin ? "col-9 ms-0 me-0 justify-content-between" : "col-12 col-md-8"}`} style={{ minHeight: 340, lineHeight: 2 }}>
          <h1 className={`align-items-center ${showMin ? "text-truncate" : ""}`} >{cache.name}
            {/* {!showMin && <span style={{ textWrap: "nowrap" }}>{stars}</span>} */}
          </h1>

          {!showMin && <>
            <div className='event-people mt-2 d-flex flex-flow-column align-items-center'>
              <FaUser className="icon" style={{ color: "green" }} />
              <span style={{ weight: "500", paddingRight: "6px" }}>{cache.attendees}</span> people attending.
            </div>
            <div className='event-loc mt-2 d-flex flex-flow-column align-items-center'>
              <FaMapMarkerAlt className="icon" style={{ color: "orange" }} onClick={() => setLocation(true)} />
              <b style={{ paddingRight: "6px" }}>Venue:</b> {cache.address}.
            </div>
            <div className='event-date event mt-2 d-flex flex-flow-column align-items-center'>
              <FaCalendarCheck className="icon" style={{ color: "skyblue" }} /> 
              <b style={{ paddingRight: "6px" }}>{new Date(cache.start_date).toLocaleDateString()} - {new Date(cache.end_date).toLocaleDateString()}</b>
            </div>
            <p style={{ lineHeight: "1.5" }} className='event-desc mt-2'>{cache.desc}</p>
          </>}

          {statusText && 
            <h6 className='align-items-center justify-content-center flex-wrap flex-sm-nowrap me-2' 
              style={{ width: "fit-content", color: StatusBgColors[cache.status] }}>
              {/* {showMin && <span style={{ textWrap: "nowrap" }}>{stars}</span>} */}
              {statusText}
            </h6>
          }
          {!showMin && <h3 className='mt-2'>Follow the event:</h3>}
          <div className={`event-social`}>
            {/* Assuming keys are "facebook", "instagram", and "twitter" */}
            {cache.social.facebook &&
              <a href={cache.social.facebook} role='button'>
                <FaFacebookSquare style={{ background: "white", height: 40, width: 40, borderRadius: 5 }} className="me-2" />
              </a>
            }
            {cache.social.twitter &&
              <a href={cache.social.twitter} role='button'>
                <FaTwitterSquare style={{ background: "white", color: "black", height: 40, width: 40, borderRadius: 5 }} className="me-2" />
              </a>
            }
            {cache.social.instagram &&
              <a href={cache.social.instagram} role='button'>
                <FaInstagramSquare style={{ background: "white", color: "red", height: 40, width: 40, borderRadius: 5 }} className="me-2" />
              </a>
            }
            <button
              className={`p-0 like-btn btn ${isLiked ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleLikeClick}
              disabled={!isPreview}>
              <FaHeart /> {likes > 0 && `(${likes})`} {isLiked ? 'Liked!' : 'Like'}
            </button>
          </div>
          {!showMin &&
            <Comment
              data={isPreview ? [{ //dummy data
                  uid: 'anonymousUserId', // Replace with a unique identifier for anonymous users
                  ctime: new Date(), // Replace with the actual creation time
                  message: 'I am coming!',
                  username: 'Anonymous', // You can customize the username for anonymous users
                }] : cache.comments
              }
              currentUser={currentUser}
              style={isPreview?{pointerEvents:"none"}:{}}
            />}

        </div>

        {showMin &&
          <div className={`button-row-ctr ${showMin ? "col-2" : "d-flex justify-content-end"}`}>
            <div className={`button-row mb-5 position-absolute`}>
              {onClose
                ? <button onClick={onClose} className="btn btn-primary me-2 event-ctrl">
                  <FaWindowClose />
                </button>
                : <button
                  onClick={() => {
                    setMin(!showMin);
                    setTimeout(() => {
                      selfRef.current.scrollIntoViewIfNeeded({ behavior: 'smooth' })
                    }, 300);
                  }}
                  className="btn btn-primary me-2 event-ctrl"
                >
                  <FaAngleDoubleDown style={{ rotate: showMin ? "0deg" : "180deg" }} />
                </button>
              }
              {onDelete &&
                <button onClick={onDelete} className="me-2 btn btn-danger event-ctrl">
                  <MdDelete />
                </button>
              }
              {onEdit &&
                <button onClick={onEdit} className="btn btn-warning me-2 event-ctrl" >
                  <FaPen color='white' />
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Event;
