import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/request-reset', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button className="auth-button" onClick={handleSubmit}>Send Reset Link</button>
      <p>{msg}</p>
    </div>
  );
}

export default ForgotPassword;
