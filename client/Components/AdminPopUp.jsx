import React, { useState } from 'react';
import "../Components/AdminPopUp.css";

const AdminPopUp = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const uid = 'EyrEUxvYnVZueLMjvX3LOX7RHVb2'; // Your UID

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://nikshoo-backend.vercel.app/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('User created successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }

      onClose(); // Close the form after submission

    } catch (error) {
      console.error('Error creating user:', error);
      alert('There was an error creating the user.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter email" 
            required
          />

          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
            required 
          />

          <div className="popup-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPopUp;
