//Import fireStore reference from frebaseInit file
import { db } from "../firebase-init";

//Import all the required functions from fireStore
import {
    collection,
    getDocs,
    where,
    query,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    documentId,
    serverTimestamp,
    arrayRemove,
    arrayUnion,
} from "firebase/firestore";


// Fetch events data from the "Events" collection based on the "attended" array
export const fetchEventsData = async (eventIDs = []) => {
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

export const deleteEventById = async (eventId) => {
    // const eventRef = collection(db, 'Events', eventId);
    await deleteDoc(doc(db, "Events", eventId.toString()));
}

export const createEvent = async (eventData) => {
    // Add a new document to the "Events" collection
    const eventsCollection = collection(db, "Events");
    const newEventRef = await addDoc(eventsCollection, {
        ...eventData,
        status: 0,
        created_at: serverTimestamp(),
    });

    // Update the "managed" array of the user with the new event ID
    const userDocRef = doc(db, "Users", eventData.uid);
    await updateDoc(userDocRef, {
        managed: arrayUnion(newEventRef.id),
    });
}

export const updateEventById = async (eventData) => {
    // Update a document in the "Events" collection
    const eventsCollection = collection(db, "Events");
    const newEventRef = await addDoc(eventsCollection, {
        ...eventData,
        updated_at: serverTimestamp(),
    });

    // Update the "managed" array of the user with new event data
    const userDocRef = doc(db, "Users", eventData.uid);
    await updateDoc(userDocRef, {
        managed: arrayUnion(newEventRef.id),
    });
}

export const addComment = async (comment) => {
    const { message, eId, uId, uname } = comment;

    // Add a new comment to the "comments" array in the event document
    const eventDocRef = doc(db, "Events", eId);
    await updateDoc(eventDocRef, {
        comments: arrayUnion({
            id: doc().id, // Generating a new comment ID
            message,
            uid: uId,
            uname,
            created_at: serverTimestamp(),
        }),
    });
};

export const updateComment = async (comment) => {
    const { message, id, eId, uId, uname } = comment;

    // Update a comment in the "comments" array in the event document
    const eventDocRef = doc(db, "Events", eId);
    await updateDoc(eventDocRef, {
        comments: arrayUnion({
            id,
            message,
            uid: uId,
            uname,
            updated_at: serverTimestamp(),
        }),
    });
};

export const deleteComment = async (commentId, eventId) => {
    // Remove the specified comment from the "comments" array in the event document
    const eventDocRef = doc(db, "Events", eventId);
    await updateDoc(eventDocRef, {
      comments: arrayRemove({ id: commentId }),
    });
};