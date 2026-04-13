// SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import '../AuthForms.css';

// Handles the login form and sends credentials to the auth API.
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const { login } = useAuth();

  // Sends login credentials to the backend and routes the user after success.
  // Posts login credentials and navigates after a successful response.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8001/auth/signin', {
        email,
        password,
      });
      if (response.data.success) { 
        alert(response.data.message);
        login({ email }, response.data.token);
        navigate('/');
             }

    } catch (error) {
      console.error('Error during sign-in', error);
      alert('Sign-in failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p>Continue to your RailSeva dashboard and complaint history.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
