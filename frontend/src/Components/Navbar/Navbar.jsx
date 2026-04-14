
import React from 'react';
import { useAuth } from '../../AuthContext'; // Adjust the path as needed
import { Link, useNavigate } from 'react-router-dom';
// Renders the shared top navigation and language picker.
const ADMIN_EMAIL = 'vipulmth1@gmail.com';

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user from context
  const navigate = useNavigate();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Renders the top navigation bar and exposes navigation shortcuts.
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 py-2">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <a className="navbar-brand fs-2 mb-0" href="/">
          <i className="bi bi-train-front-fill"></i>
          RailSeva
        </a>

        <div className="d-flex align-items-center gap-2 ms-auto">
          {isAdmin && (
            <>
              <Link to='/admindashboard'><button className="btn btn-outline-dark">Admin</button></Link>
              <Link to='/department'><button className="btn btn-outline-dark">Department</button></Link>
            </>
          )}
          <LanguageSelector />

          {!user && (
            <>
              <Link to='/signup'><button className="btn btn-dark">Sign Up</button></Link>
              <Link to='/signin'><button className="btn btn-outline-dark">Sign In</button></Link>
            </>
          )}

          {user && (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;



