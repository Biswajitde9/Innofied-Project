import React from 'react'
import Alert from './Alert';
import Event from './Event';
import { StatusTextArray } from './Event';

const EventsList = ({events,currentUser,handleEdit,handleDelete,setAlert}) => {
  return (
    <div className="row evt-container">
        {events && events.map((event, index) => (
        <div key={index} className="col-md-12">
            <Event event={event} 
                currentUser={currentUser}
                isMin={true} 
                onEdit={currentUser.managed.includes(event.id) ? ()=>handleEdit(event) : null} 
                onDelete={()=>{
                    //get event details
                    let message = "";
                    switch(StatusTextArray[event.status]){
                    case 'PLANNED': 
                        message = <>
                        Are you sure you wish to delete the planned event <span className="text-danger">{event.name}</span>?
                        If you are trying to delay the event you can cancel now choose that option instead. All participants will be notified.
                        </>
                        break;
                    case 'DELAYED': break;
                        message = <>
                        Are you sure you wish to delete the event <span className="text-danger">{event.name}</span>?
                        All participants will be notified.
                        </>
                        break;
                    case 'STARTED': break;
                        message = <>
                        Are you sure you wish to delete the ongoing event <span className="text-danger">{event.name}</span>?
                        If you are trying to delay the event you can cancel now choose that option instead. All participants will be notified.
                        </>
                        break;
                    case 'CANCELLED': case 'ENDED':
                        message = <>
                        Are you sure you wish to permanently cancel and delete the event <span className="text-danger">{event.name}</span>?
                        If you are trying to restart the event you can cancel now choose that option instead. All participants will be notified.
                        </>
                        break;
                    }

                    //make alert box
                    setAlert(
                    <Alert title={"DELETE CONFIRMATION"} 
                        onAccept={() => { 
                        handleDelete(event); 
                        setAlert(null) 
                        }} 
                        onClose={() => setAlert(null)}
                        message={message}
                    />
                    );
                    
                }} />
            </div>
        ))}
    </div>
  )
}

export default EventsList