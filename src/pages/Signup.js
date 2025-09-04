import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({
    id:'',
    name: '',
    email: '',
    password: '',
    phone: '',
    dept_id:''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ loading, setLoading] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
   
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth');
        setAllUsers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const {id, name, email, password, phone, dept_id } = form;

    if (!id || !name || !email || !password || !phone || !dept_id) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const finalForm = {
      id ,
      name,
      email,
      password,
      phone,
      dept_id
    };

     
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalForm)
      });
 
      const result = await response.json();
 
      if (response.ok) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
 
    setLoading(false);
  };
 
 

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <input
          name="id"
          placeholder="User ID"
          value={form.id}
          onChange={handleChange}
          className="auth-input"
        />

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="auth-input"
        />

        <input
          name="dept_id"
          placeholder="DEPARTMENT ID"
          value={form.dept_id}
          onChange={handleChange}
          className="auth-input"
        />

        <button onClick={handleSignup} className="auth-button">Register</button>
        <p className="auth-text">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
