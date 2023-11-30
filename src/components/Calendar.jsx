import React, { useState, useEffect } from 'react';
import Event from './Event';
import { db } from '../firebase-init';
import { collection, getDocs, where, query } from 'firebase/firestore';

const Calendar = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);

  const fetchEventsData = async (selectedDate) => {
    const eventsData = [];
    try {
      const eventsCollection = collection(db, 'Events');
      let q;
      if (user) {
        q = query(
          eventsCollection,
          where('uid', '==', user.uid),
          where('start_date', '>=', selectedDate),
          where('start_date', '<', new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
        );
      } else {
        q = query(
          eventsCollection,
          where('start_date', '>=', selectedDate),
          where('start_date', '<', new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
        );
      }

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        eventsData.push(doc.data());
      });

      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events data:', error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchEventsData(selectedDate);
  }, [selectedDate, user]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleEventClick = (event) => {
    setExpandedEvent(event);
  };

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-sm-10">
          <div className='d-flex align-items-center'>
            <label className="col-sm-2 me-2 form-label" htmlFor="datePicker">Select Date:</label>
            <input className="col-sm-8 form-control" 
              type="date"
              id="datePicker"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              />
          </div>
        </div>
      </div>

      <div className="scroll-box" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {events.map((event, index) => (
          <div key={index} className="mb-3">
            <div
              className="card clickable col-sm-12"
              onClick={() => handleEventClick(event)}
            >
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text">{event.address}</p>
              </div>
            </div>
            {expandedEvent && expandedEvent === event && (
              <div className="mt-2 col-12">
                <button className='btn btn-danger' style={{float:"right"}} onClick={()=>setExpandedEvent(null)}>X</button>
                <Event event={event} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
