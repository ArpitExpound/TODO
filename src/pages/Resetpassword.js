import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async () => {
  try {
    const res = await axios.post('http://localhost:5000//auth/reset-password', { password });
    setMsg(res.data.message);
    setTimeout(() => navigate('/login'), 2000); 
  } catch (err) {
    setMsg(err.response?.data?.message || 'Error occurred');
  }
};

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="auth-button" onClick={handleReset}>Reset</button>
      <p>{msg}</p>
    </div>
  );
}

export default ResetPassword;