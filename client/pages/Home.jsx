import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Admin.css'; // Make sure to import the CSS file

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading to true when the form is submitted

    const data = { email, password };

    try {
      const response = await fetch('https://nikshoo-backend.vercel.app/adminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Display an alert with the error message from the backend if available
        alert(result.message || 'Login failed. Please try again.');
        throw new Error('Network response was not ok');
      } else {
        // Successful login
        localStorage.setItem('authToken', result.userId);
        navigate('/admin'); // Redirect to admin page
      }

    } catch (error) {
      // Handle error if needed
      console.error(error);
    } finally {
      setLoading(false); // Set loading back to false after the request is complete
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" disabled={loading}> 
            {loading ? 'Logging you in...' : 'Login'} {/* Change button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
