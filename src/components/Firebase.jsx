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
    getDoc,
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

export const deleteMediaByIndex = async (eventId, mediaId) => {
    const eventRef = doc(db, 'Events', eventId);

    // Retrieve the current document data
    const eventSnapshot = await getDoc(eventRef);
    const eventData = eventSnapshot.data();

    // Check if the index is within the valid range
    if (mediaId >= 0 && mediaId < eventData.media_urls.length) {
        // Use arrayRemove to remove the element at the specified index
        await updateDoc(eventRef, {
            media_urls: arrayRemove(eventData.media_urls[mediaId]),
        })
    }
}

export const addEventLike = async (eventId, userId) => {
    const eventRef = doc(db, 'Events', eventId);

    // Retrieve the current document data
    const eventSnapshot = await getDoc(eventRef);
    const eventData = eventSnapshot.data();

    if (eventData.rating && eventData.rating.includes(userId)) {
        // User already liked, so remove the like
        await updateDoc(eventRef, {
            rating: arrayRemove(userId),
        });

        console.log('Like removed successfully.');
    } else {
        // User hasn't liked yet, so add the like
        await updateDoc(eventRef, {
            rating: arrayUnion(userId),
        });

        console.log('Like added successfully.');
    }
}

export const addUser = async (formData) => {
    // Check if user with provided email already exists in the "Users" collection
    const usersCollection = collection(db, "Users");
    
    // Create a new document in the "Users" collection
    const newUserDocRef = await addDoc(usersCollection, {
        email: formData.email,
        username: formData.username,
        address: formData.address,
        password: formData.password,
        phone: formData.phone
    });

    // Successfully created a new user
    const userData = {
        email: formData.email,
        username: formData.username,
        uid: newUserDocRef.id, // Assuming the document ID can be used as a user ID
    };
    
    return userData;
}

export const userExists = async (email, phone, username) => {
    const usersCollection = collection(db, "Users");

    // Create a query that checks for the existence of a user with any of the provided values
    const userQuery = query(
        usersCollection,
        where("email", "==", email),
        where("phone", "==", phone),
        where("username", "==", username)
    );

    const userQuerySnapshot = await getDocs(userQuery);
    return userQuerySnapshot.size > 0;
};

// Function to check if a user with the provided email already exists
export const emailExists = async (email) => {
    const usersCollection = collection(db, "Users");
    const emailQuery = query(usersCollection, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);
    return emailQuerySnapshot.size > 0;
};

// Function to check if a user with the provided phone already exists
export const phoneExists = async (phone) => {
    const usersCollection = collection(db, "Users");
    const phoneQuery = query(usersCollection, where("phone", "==", phone));
    const phoneQuerySnapshot = await getDocs(phoneQuery);
    return phoneQuerySnapshot.size > 0;
};

// Function to check if a user with the provided username already exists
export const usernameExists = async (username) => {
    const usersCollection = collection(db, "Users");
    const usernameQuery = query(usersCollection, where("username", "==", username));
    const usernameQuerySnapshot = await getDocs(usernameQuery);
    return usernameQuerySnapshot.size > 0;
};
