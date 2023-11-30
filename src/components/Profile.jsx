import React, { useState, useEffect } from 'react'
import Calendar from './Calendar';
import Event from './Event'
import CreateEvent from './CreateEvent';

//Import fireStore reference from frebaseInit file
import {db} from "../firebase-init";

//Import all the required functions from fireStore
import { collection, getDocs, where, query,deleteDoc,doc} from "firebase/firestore"; 

const Profile = ({ currentUser }) => {
  const [events, setEvents] = useState();
  const [selfEvents, setSelfEvents] = useState();
  const [activeTab, setActiveTab] = useState('managing');

  // Fetch events data from the "Events" collection based on the "attended" array
  const fetchEventsData = async (eventIDs=[]) => {
    const eventsData = [];

    // Loop through each event reference in the "attended" array
    for (const eventId of eventIDs) {
      try {
        // Create a query to find events based on the "attended" array
        const eventsCollection = collection(db, 'Events');
        const q = query(eventsCollection, where('uid', '==', currentUser.uid));
    
        // Execute the query
        const querySnapshot = await getDocs(q);
    
        // Loop through the query results and add event data to eventsData array
        querySnapshot.forEach((doc) => {
          eventsData.push({
            id:doc.id,
            ...doc.data()
          });
        });
    
        return eventsData;
      } catch (error) {
        console.error('Error fetching events data:', error);
        // Handle error
        return eventsData; // Return an empty array or handle error as needed
      }
    }

    return eventsData;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

// Function to delete an event
const deleteEvent = async (eventId) => {
  console.log(eventId);
  try {
    // const eventRef = collection(db, 'Events', eventId);
    await deleteDoc(doc(db, "Events", eventId.toString()));

    // Fetch updated events data after deletion
    fetchUpdatedEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    // Handle error
  }
};

// Fetch updated events data after deletion
const fetchUpdatedEvents = () => {
  // Call the function to fetch attended events data
  fetchEventsData(currentUser.attended).then((eventsData) => {
    console.log('Fetched attended events data:', eventsData);
    setEvents(eventsData);
  });

  // Fetch self-managed events data
  fetchEventsData(currentUser.managed).then((eventsData) => {
    console.log('Fetched managed events data:', eventsData);
    setSelfEvents(eventsData);
  });
};


  useEffect(() => {
    // Call the function to fetch attended events data
    fetchEventsData(currentUser.attended).then((eventsData) => {
      console.log('Fetched attended events data:', eventsData);
      setEvents(eventsData)
    });
    
    // Fetch self managed events data
    fetchEventsData(currentUser.managed).then((eventsData) => {
      console.log('Fetched managed events data:', eventsData);
      setSelfEvents(eventsData)
    });
  }, [currentUser])

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleTabChange('upcoming')}
          >
            Upcoming
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'managing' ? 'active' : ''}`}
            onClick={() => handleTabChange('managing')}
          >
            Managing
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'attending' ? 'active' : ''}`}
            onClick={() => handleTabChange('attending')}
          >
            Attended
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleTabChange('create')}
          >
            Create Event
          </button>
        </li>
      </ul>

      <div className="mt-3">
        {activeTab === 'managing' && (
          <div className="row">
            {selfEvents && selfEvents.map((event, index) => (
              <div key={index} className="col-md-12 mb-4">
                <Event event={event} onDelete={deleteEvent}/>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attending' && (
          <div className="row">
            {events && events.map((event, index) => (
              <div key={index} className="col-md-12 mb-4">
                <Event event={event} onDelete={deleteEvent} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <Calendar user={currentUser} />
        )}
        {activeTab === 'create' && (
          <CreateEvent user={currentUser} />
        )}
      </div>
    </div>
  )
}

export default Profile