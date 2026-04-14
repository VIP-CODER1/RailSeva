 // VerifyOtp.jsx
 import React, { useState } from 'react';
 import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import '../AuthForms.css';
 // Verifies the OTP that was sent after signup.
 const VerifyOtp = () => {
   const [email, setEmail] = useState('');
   const [otp, setOtp] = useState('');
const navigate = useNavigate(); 
const { login } = useAuth();

   // Verifies the OTP sent to the user's mobile number.
  // Confirms the OTP with the backend and redirects on success.
  const handleSubmit = async (e) => {
     e.preventDefault();

     try {
       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/verify-otp`, {
         email,
         otp,
       });
      if (response.data.success) { // Assuming the response contains a success field
alert(response.data.message);
    login({ email }, response.data.token);
navigate('/');
     } }catch (error) {
       console.error('Error during OTP verification', error);
       alert('OTP verification failed');
     }
   };

   return (
     <div className="auth-page">
       <div className="auth-card">
         <h2>Verify OTP</h2>
         <p>Enter the OTP sent to your email to complete sign in.</p>
         <form onSubmit={handleSubmit}>
           <div className="mb-3">
             <label htmlFor="email" className="form-label">Email</label>
             <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
           </div>
           <div className="mb-3">
             <label htmlFor="otp" className="form-label">OTP</label>
             <input type="text" className="form-control" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
           </div>
           <button type="submit" className="btn btn-primary auth-submit">Verify OTP</button>
         </form>
       </div>
     </div>
   );
 };

 export default VerifyOtp;

