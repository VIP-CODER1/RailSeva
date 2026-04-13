
import React from 'react';
import { useAuth } from '../../AuthContext'; // Adjust the path as needed
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../languageSelector'; 
import {Link} from 'react-router-dom'
// Renders the shared top navigation and language picker.
const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Get user from context

  // Renders the top navigation bar and exposes navigation shortcuts.
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-between">
       
        <div className="row d-flex justify-between">
          <div className="col-md-5">


          <a className="navbar-brand fs-2" href="/">
          <i className="bi bi-train-front-fill"></i>
          RailSeva
        </a>
        
          </div>
          <div className="col-md-6">
          <div>
          <ul className="navbar-nav md-auto">

<li className="nav-item me-2">
  <Link to='/admindashboard'><button className="btn btn-outline-dark">Admin</button></Link>
</li>
<li className="nav-item me-2">
  <Link to='/department'><button className="btn btn-outline-dark">Department</button></Link>
</li>
<li className="nav-item">
  <LanguageSelector />
</li>
</ul>
          </div>

          </div>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;



