import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from './chatBot';




// Wraps the chatbot route in the app shell used for this screen.
const Home = () => {

  

  // Hosts the navigation shell for the chatbot screen.
  return (
    <div>
       <Router>
      <Navbar />
      <Routes>
        
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
      
     
      
    </div>
  );
};

export default Home;