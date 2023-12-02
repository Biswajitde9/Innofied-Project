import React, { useState, useEffect } from 'react'
import Calendar from './Calendar';
import Event from './Event'
import CreateEvent from './CreateEvent';

//Import fireStore reference from frebaseInit file
import { db } from "../firebase-init";

//Import all the required functions from fireStore
import { collection, documentId, getDocs, where, query, deleteDoc, doc } from "firebase/firestore";

const Profile = ({ currentUser }) => {
  const [events, setEvents] = useState();
  const [selfEvents, setSelfEvents] = useState();
  const [activeTab, setActiveTab] = useState('managing');

  // Fetch events data from the "Events" collection based on the "attended" array
  const fetchEventsData = async (eventIDs = []) => {
    console.log("EVent ID pass Karo",eventIDs);
    const eventsData = [];
    if (eventIDs.length == 0) return eventsData;

    // Create a query to find events based on the "attended" array
    const eventsCollection = collection(db, 'Events');
    const q = query(eventsCollection, where(documentId(), 'in', eventIDs));

    try {
      // Execute the query
      const querySnapshot = await getDocs(q);
      const eventsData = [];
    
      // Loop through the query results and add event data to eventsData array
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });

      return eventsData;
    } catch (error) {
      console.error('Error fetching events data:', error);
      // Return an empty array or handle error as needed
    }
    
    return eventsData;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to delete an event
  const handleDelete = async (eventId) => {
    console.log(eventId);
    try {
      // const eventRef = collection(db, 'Events', eventId);
      await deleteDoc(doc(db, "Events", eventId.toString()));
      // Fetch updated events data after deletion
      fetchUpdatedEvents();
      setActiveTab('managing');
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle error
    }
  };

  const handleEdit = (eventId)=>{
    setActiveTab('managing');
  }

  const handleCreate = ()=>{
    setActiveTab('managing');
  }

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
    fetchUpdatedEvents();
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
                <Event event={event} onEdit={()=>handleEdit(event.id)} onDelete={()=>handleDelete(event.id)} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attending' && (
          <div className="row">
            {events && events.map((event, index) => (
              <div key={index} className="col-md-12 mb-4">
                <Event event={event} onEdit={currentUser.managed.includes(event.id) ? null : ()=>handleEdit(event.id)} onDelete={()=>handleDelete(event.id)} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <Calendar user={currentUser} />
        )}
        {activeTab === 'create' && (
          <CreateEvent user={currentUser} onCreate={handleCreate} />
        )}
      </div>
    </div>
  )
}

export default Profile