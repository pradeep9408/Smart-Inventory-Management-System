import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>User Profile</strong>
        </h3>
      </header>
      {currentUser ? (
        <div>
          <div className="card mb-4">
            <div className="card-header">User Information</div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Username:</strong>
                </div>
                <div className="col-md-9">{currentUser.username}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Email:</strong>
                </div>
                <div className="col-md-9">{currentUser.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Full Name:</strong>
                </div>
                <div className="col-md-9">{currentUser.fullName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Roles:</strong>
                </div>
                <div className="col-md-9">
                  <ul>
                    {currentUser.roles &&
                      currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          Please log in to view your profile.
        </div>
      )}
    </div>
  );
};

export default Profile; 