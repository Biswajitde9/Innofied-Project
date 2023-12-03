import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, userExists, emailExists, phoneExists, usernameExists } from "./Firebase";

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    firstName: "",
    secondName: "",
    confirmPassword: "",
  });
  const [warnings, setWarnings] = useState({
    email: "",
    phone: "",
    username: "",
    passwordMatch: "",
  });
  const [error, setError] = useState(null);
  
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateFields = () => {
    // Add your validation logic here and update warnings state accordingly
    const newWarnings = {
      email: emailExists(formData.email) ? "Email already in use." : "",
      phone: phoneExists(formData.phone) ? "Phone number already in use." : "",
      username: usernameExists(formData.username) ? "Username already in use." : "",
      passwordMatch: formData.password !== formData.confirmPassword ? "Passwords do not match." : "",
    };
    setWarnings(newWarnings);

    // Check if any warning exists
    return Object.values(newWarnings).every((warning) => warning === "");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      // Don't proceed with signup if there are validation warnings
      return;
    }

    try {
      let exists = await userExists(formData.email,formData.phone,formData.username);
      if(!exists){
        const userData = await addUser(formData);
  
        setError(null);
        nav("/");
        onSignup(userData);
  
        // Save user data to local storage
        localStorage.setItem("user", JSON.stringify(userData));

      } else {
        // Parameter is already in use
        setError(`${exists?"Email":exists>1?"Phone":"Username"} is already in use. Please use a different one or login using the existing ID.`);
        return;
      }
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
          <label className="form-label">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Second Name:</label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Username (Visible to others):</label>
          <input
            type="text"
            name="username"
            value={formData.username}
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
          <label className="form-label">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
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
      {Object.entries(warnings).map(([key, value]) => value && <div key={key} style={{ color: "orange" }}>{value}</div>)}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
};

export default Signup;
