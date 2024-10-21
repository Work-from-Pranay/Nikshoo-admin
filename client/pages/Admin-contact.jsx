import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const AdminContact = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('https://nikshoo-backend.vercel.app/admin/enquiry?uid=EyrEUxvYnVZueLMjvX3LOX7RHVb2');
        const data = await response.json();
        const enquiriesArray = Object.entries(data.enquiries).map(([id, enquiry]) => ({
          id,
          ...enquiry
        }));

        // Log each enquiry ID
        // enquiriesArray.forEach(enquiry => console.log(enquiry.id));

        setEnquiries(enquiriesArray);
        setFilteredEnquiries(enquiriesArray);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchEnquiries();
  }, []);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const results = enquiries.filter((enquiry) => {
      return (
        enquiry.name.toLowerCase().includes(normalizedSearchTerm) ||
        enquiry.email.toLowerCase().includes(normalizedSearchTerm) ||
        enquiry.contactNo.includes(normalizedSearchTerm) ||
        enquiry.location.toLowerCase().includes(normalizedSearchTerm) ||
        enquiry.organisation.toLowerCase().includes(normalizedSearchTerm) ||
        enquiry.areaSqFt.includes(normalizedSearchTerm) ||
        enquiry.budget.includes(normalizedSearchTerm)
      );
    });

    setFilteredEnquiries(results);
  }, [searchTerm, enquiries]);

  const convertToCSV = (enquiries) => {
    const headers = ['Name', 'Email', 'Contact No', 'Location', 'Organisation', 'Area (Sq Ft)', 'Budget', 'Date'];
    const rows = enquiries.map((enquiry) => [
      enquiry.name,
      enquiry.email,
      enquiry.contactNo,
      enquiry.location,
      enquiry.organisation,
      enquiry.areaSqFt,
      enquiry.budget,
      new Date(enquiry.createdAt).toLocaleDateString(),
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredEnquiries);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'enquiries.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {


    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await fetch(`https://nikshoo-backend.vercel.app/admin/enquiry/${id}?uid=EyrEUxvYnVZueLMjvX3LOX7RHVb2`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setEnquiries(enquiries.filter(enquiry => enquiry.id !== id));
          alert('Enquiry deleted successfully');
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        alert('Failed to delete enquiry');
      }
    }
  };


  return (
    <div className="container-contact">
      <div className="contacts">
        <h1 className='h1-con'>Homepage</h1>

        <input
          type="text"
          className='search'
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />

        <button
          onClick={downloadCSV}
          style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            backgroundColor: '#09655b',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Download CSV
        </button>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Location</th>
                <th>Organisation</th>
                <th>Area (Sq Ft)</th>
                <th>Budget</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr key="loading">
                  <td colSpan="9">
                    <div className="loading-container">
                      <FaSpinner className="loading-icon" />
                    </div>
                  </td>
                </tr>
              ) : filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.createdAt}>
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.contactNo}</td>
                    <td>{enquiry.location}</td>
                    <td>{enquiry.organisation}</td>
                    <td>{enquiry.areaSqFt}</td>
                    <td>{enquiry.budget}</td>
                    <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                      }} onClick={() => handleDelete(enquiry.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-enq">
                  <td colSpan="9">No enquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
