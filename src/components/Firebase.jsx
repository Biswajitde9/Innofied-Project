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

export const fetchUserData = async (userId ) => {
    let userData = {};
    if(userId==null){
        return userData;
    }
    // Create a query to find events based on the "attended" array
    const eventsCollection = collection(db, 'Users');
    const q = query(eventsCollection, where(documentId(), '==', userId));

    try {
        // Execute the query
        const querySnapshot = await getDocs(q);
        const eventsData = [];

        // Loop through the query results and add event data to eventsData array
        querySnapshot.forEach((doc) => {
            userData=({ id: doc.id, ...doc.data() });
        });

        return userData;
    } catch (error) {
        console.error('Error fetching events data:', error);
        // Return an empty array or handle error as needed
    }

    return userData;
};

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
    const eventRef = doc(db, 'Events', eventId.toString());

    // Get the event data before deleting it
    const eventSnapshot = await getDoc(eventRef);
    const eventData = eventSnapshot.data();

    // Delete the event
    await deleteDoc(eventRef);

    // Remove the event ID from the user's "managed" array
    const userDocRef = doc(db, "Users", eventData.uid);
    await updateDoc(userDocRef, {
        managed: arrayRemove(eventId),
    });
};


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
try{
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
}catch(e){
    console.log("error",e);
}
};

export const updateComment = async (comment) => {
    try {
        const { message, id, eId, uId, uname } = comment;

        // Ensure the "comments" field is initialized as an array in your document
        const eventDocRef = doc(db, "Events", eId);
        const eventDoc = await getDoc(eventDocRef);

        if (eventDoc.exists()) {
            const existingComments = eventDoc.data().comments || [];

            // Log the existing comments for debugging
            console.log("Existing comments:", existingComments);

            // Update a comment in the "comments" array in the event document
            await updateDoc(eventDocRef, {
                comments: arrayUnion({
                    id,
                    message,
                    uid: uId,
                    uname,
                    updated_at: serverTimestamp(),
                }),
            });

            console.log("Comment updated successfully.");
        } else {
            console.error(`Event document with ID ${eId} not found.`);
        }
    } catch (error) {
        console.error("Error updating comment:", error);
    }
};


export const deleteComment = async (commentId, eventId) => {
    // Remove the specified comment from the "comments" array in the event document
    console.log('Deleting comment:', commentId, 'from event:', eventId);

    if (!commentId || !eventId) {
        console.error('Invalid commentId or eventId');
        return;
    }

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
        firstName:formData.firstName,
        lastName:formData.secondName,
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
    return userQuerySnapshot.docs.length > 0;
};

// Function to check if a user with the provided email already exists
export const emailExists = async (email) => {
    const usersCollection = collection(db, "Users");
    const emailQuery = query(usersCollection, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);
    console.log(emailQuerySnapshot.docs);
    return emailQuerySnapshot.docs.length > 0;
};

// Function to check if a user with the provided phone already exists
export const phoneExists = async (phone) => {
    const usersCollection = collection(db, "Users");
    const phoneQuery = query(usersCollection, where("phone", "==", phone));
    const phoneQuerySnapshot = await getDocs(phoneQuery);

    console.log("Phone Query Documents:", phoneQuerySnapshot.docs);

    return phoneQuerySnapshot.docs.length > 0;
};

// Function to check if a user with the provided username already exists
export const usernameExists = async (username) => {
    const usersCollection = collection(db, "Users");
    const usernameQuery = query(usersCollection, where("username", "==", username));
    const usernameQuerySnapshot = await getDocs(usernameQuery);

    console.log("Username Query Documents:", usernameQuerySnapshot.docs);

    return usernameQuerySnapshot.docs.length > 0;
};

