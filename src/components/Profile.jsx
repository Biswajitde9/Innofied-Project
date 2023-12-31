import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import CreateEvent from "./CreateEvent";
import UserProfile from "./UserProfile";
import Alert from "./Alert";

import EventsList from "./EventsList";
import TabNavigation from "./TabNavigation";
import {
  createEvent,
  deleteEventById,
  fetchEventsData,
  fetchUserData,
  updateEventById,
} from "./Firebase";

const Profile = ({ currentUser, setCurrentUser }) => {
  const [events, setEvents] = useState();
  const [selfEvents, setSelfEvents] = useState();
  const [activeTab, setActiveTab] = useState("managing");
  const [alert, setAlert] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);

  const handleTabChange = (tab) => {
    if (activeTab == "create")
      setAlert(
        <Alert
          title="Discard changes?"
          message="You will lose your changes if you leave this page."
          onClose={() => {
            setAlert(null);
          }}
          onAccept={() => {
            setCurrentEvent(null);
            setActiveTab(tab);
            setAlert(null);
          }}
        />
      );
    else setActiveTab(tab);
  };

  // Function to delete an event
  const handleDelete = async (event) => {
    if (currentUser) {
      setAlert(
        <Alert
          title="Delete Failure"
          message="You are not logged in!"
          onClose={() => setAlert(null)}
        />
      );
    } else if (currentUser.managed.includes(event.id)) {
      setActiveTab("managing");
      try {
        deleteEventById(event.id);
        // Fetch updated events data after deletion
        fetchUpdatedEvents();
        setActiveTab("managing");
      } catch (error) {
        setAlert(
          <Alert
            title="Delete Failure"
            message={`Error deleting event: ${error}`}
            onClose={() => setAlert(null)}
          />
        );
      }
    } else {
      setAlert(
        <Alert
          title="Delete Failure"
          message="You are not authorized to delete this event!"
          onClose={() => setAlert(null)}
        />
      );
    }
  };

  const handleEdit = (event) => {
    if (!currentUser) {
      setAlert(
        <Alert
          title="Edit Failure"
          message="You are not logged in!"
          onClose={() => setAlert(null)}
        />
      );
    } else if (currentUser.managed.includes(event.id)) {
      setCurrentEvent(event);
      setActiveTab("create");
    } else {
      setAlert(
        <Alert
          title="Edit Failure"
          message="You are not authorized to edit this event!"
          onClose={() => setAlert(null)}
        />
      );
    }
  };

  const handleEventUpdate = async (event) => {
    try {
      if (!currentUser) {
        setAlert(
          <Alert
            title="Edit Failure"
            message="You are not logged in!"
            onClose={() => setAlert(null)}
          />
        );
      } else if (event.id == null) {
        await createEvent({ ...event, uid: currentUser.id });
      } else if (currentUser.managed.includes(event.id)) {
        await updateEventById({ ...event, uid: currentUser.id });
      } else {
        setAlert(
          <Alert
            title="Edit Failure"
            message="You are not authorized to edit this event!"
            onClose={() => setAlert(null)}
          />
        );
      }
    } catch (e) {
      console.log("error: ", e);
    }

    const element = document.getElementById(event.id);
    if (element) {
      element.scrollIntoViewIfNeeded({ behavior: "smooth" });
    }

    setCurrentEvent(null);
    fetchUpdatedEvents();
    setActiveTab("managing");
  };

  // Fetch updated events data after deletion
  const fetchUpdatedEvents = async () => {
    console.log(currentUser);
    const userData = await fetchUserData(currentUser.id);
    console.log(userData);
    // Call the function to fetch attended events data
   
    console.log(userData);
    await fetchEventsData(userData.attended).then((eventsData) => {
      //console.log('Fetched attended events data:', eventsData);
      setEvents(eventsData);
    });

    // Fetch self-managed events data
    fetchEventsData(userData.managed).then((eventsData) => {
      //console.log('Fetched managed events data:', eventsData);
      setSelfEvents(eventsData);
    });
  };

  useEffect(() => {
    fetchUpdatedEvents();
  }, [currentUser]);

  return (
    <div className="container my-5">
      <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />

      <div className="mt-3">
        {activeTab === "managing" && (
          <EventsList
            currentUser={currentUser}
            events={selfEvents}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            setAlert={setAlert}
          />
        )}

        {activeTab === "attending" && (
          <EventsList
            currentUser={currentUser}
            events={events}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            setAlert={setAlert}
          />
        )}

        {activeTab === "upcoming" && <Calendar user={currentUser} />}
        {activeTab === "create" && (
          <CreateEvent
            currentUser={currentUser}
            event={currentEvent}
            onCreate={handleEventUpdate}
          />
        )}
        {activeTab === "profile" && (
          <UserProfile user={currentUser} viewer={currentUser} />
        )}
      </div>
      {alert}
    </div>
  );
};

export default Profile;
