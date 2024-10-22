import React, { useState, useEffect } from 'react';
import '../pages/Admin.css'; // Importing the CSS file for specific styles

const AdminData = () => {
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    addresses: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the data on component mount
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('https://nikshoo-backend.vercel.app/api/contact-info-1');
        if (!response.ok) {
          throw new Error('Failed to fetch contact data.');
        }
        const data = await response.json();
        setContactData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchContactData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://nikshoo-backend.vercel.app/api/contact-info-1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error('Failed to update contact data.');
      }

      alert('Contact data updated successfully!');
    } catch (err) {
      alert('Error updating contact data. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-data-container">
      <h2 className="admin-data-heading">Contact Page Data</h2>
      <form className="admin-data-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={contactData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={contactData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>WhatsApp:</label>
          <input
            type="text"
            name="whatsapp"
            value={contactData.whatsapp}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Addresses:</label>
          <input
            type="text"
            name="addresses"
            value={contactData.addresses}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Edit Contact Info</button>
      </form>
    </div>
  );
};

export default AdminData;
