// App.js

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import Header from "./components/Header"

const App = () => {
  // State to track login status
  const [isLoggedIn, setLoggedIn] = useState(false);

  // State to store the user's name
  const [currentUser, setCurrentUser] = useState(null);

  // Check for logged-in user from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setLoggedIn(true);
    }
  }, []);
  
  // Function to handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Function to handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            index
            element={
              <div>
                <div className="mt-3 mb-3">
                  {isLoggedIn && (
                    <div className="alert alert-success" role="alert">
                      Welcome, {currentUser.name}!
                    </div>
                  )}
                </div>
                <div>
                  {isLoggedIn ? (
                    <Profile currentUser={currentUser} />
                  ) 
                  : <Calendar />
                }
                </div>
              </div>
            }
          />
        </Route>
        {!isLoggedIn && 
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        }
      </Routes>
    </BrowserRouter>
  );
};

export default App;
