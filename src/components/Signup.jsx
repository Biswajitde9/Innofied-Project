import { useState } from "react";
import { collection, getDocs, where, query, addDoc } from "firebase/firestore";
import { db } from "../firebase-init";
import { useNavigate } from "react-router-dom";

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  
  const nav = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Check if user with provided email already exists in the "Users" collection
      const usersCollection = collection(db, "Users");
      const emailQuery = query(
        usersCollection,
        where("email", "==", formData.email)
      );
      const emailQuerySnapshot = await getDocs(emailQuery);

      if (emailQuerySnapshot.size > 0) {
        // Email is already in use
        setError("Email is already in use. Please use a different email.");
        return;
      }

      // Create a new document in the "Users" collection
      const newUserDocRef = await addDoc(usersCollection, {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phone: formData.phone
      });


      // Successfully created a new user
      const userData = {
        email: formData.email,
        name: formData.name,
        uid: newUserDocRef.id, // Assuming the document ID can be used as a user ID
      };

      setError(null);
      nav("/");
      onSignup(userData);

      // Save user data to local storage
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error during Signup:", error);
      // Handle error
      setError("Error during Signup. Please try again.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="row justify-content-end m-2 p-2 bg-light"
      >
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mt-md-4">
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
        </div>
      </form>
      {error && <span style={{ color: "red" }}>{error}</span>}
    </>
  );
};

export default Signup;
