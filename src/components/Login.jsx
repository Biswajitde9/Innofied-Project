import { useState } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../firebase-init';
import { useNavigate } from 'react-router-dom';
const Login = ({ onLogin }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if user with provided username and password exists in the "Users" collection
      const usersCollection = collection(db, 'Users');
      const q = query(
        usersCollection,
        where('email', '==', formData.email),
        where('password', '==', formData.password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 1) {
        // Successfully found a user with the provided username and password
        const userData = querySnapshot.docs[0].data();
        setError(null);
        nav("/");
        onLogin({ ...userData, uid: querySnapshot.docs[0].id });
      } else {
        // No user found with the provided username and password
        let errorMessage = 'Invalid username or password. Please try again.';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error
      let errorMessage = 'Error during login. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='row justify-content-end'>
        <div className="mb-3 col-sm-4">
          <label className="form-label" style={{display:"inline"}}>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3 col-sm-4">
          <label className="form-label" style={{display:"inline"}}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mt-4 col-sm-2">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </>
  );
};

export default Login;
