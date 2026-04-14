
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../AuthForms.css';

// Collects registration details and starts the OTP signup flow.
const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Submits the registration form and sends the user to OTP verification.
  // Sends the registration form to the backend and advances to OTP verification.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting sign-up form');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
        name,
        email,
        password,
      });
      console.log('Sign-up response:', response.data);
      alert(response.data.message);
      
      // Navigate to the VerifyOTP page
      navigate('/verify-otp');
    } catch (error) {
      console.error('Error during sign-up', error);
      const serverMessage = error?.response?.data?.message;
      alert(`Sign-up failed: ${serverMessage || error.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <p>Create your RailSeva account to file and track complaints.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
