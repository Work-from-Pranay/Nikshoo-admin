import React, { useEffect, useState } from 'react';

const AdminContactTwo = () => {
  const [contacts, setContacts] = useState([]);
  const [uid] = useState('EyrEUxvYnVZueLMjvX3LOX7RHVb2'); // Assuming uid is constant
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredContacts, setFilteredContacts] = useState([]); 
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('https://nikshoo-backend.vercel.app/admin/contact?uid=EyrEUxvYnVZueLMjvX3LOX7RHVb2');
        const data = await response.json();
        const contactsArray = Object.entries(data.contacts).map(([id, contact]) => ({
          id,
          ...contact
        }));
        
        setContacts(contactsArray);
        setFilteredContacts(contactsArray);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchContacts();
  }, [uid]);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const results = contacts.filter((contact) => (
      contact.fullName.toLowerCase().includes(normalizedSearchTerm) ||
      contact.email.toLowerCase().includes(normalizedSearchTerm) ||
      contact.phoneNumber.includes(normalizedSearchTerm) ||
      contact.location.toLowerCase().includes(normalizedSearchTerm) ||
      contact.message.toLowerCase().includes(normalizedSearchTerm)
    ));

    setFilteredContacts(results);
  }, [searchTerm, contacts]);

  // Function to convert filteredContacts to CSV format
  const convertToCSV = (contacts) => {
    const headers = ['Full Name', 'Email', 'Phone Number', 'Location', 'Message', 'Date'];

    const rows = contacts.map((contact) => [
      contact.fullName,
      contact.email,
      contact.phoneNumber,
      contact.location,
      contact.message,
      new Date(contact.createdAt).toLocaleDateString(),
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Function to download CSV
  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredContacts);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to delete a contact
  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await fetch(`https://nikshoo-backend.vercel.app/admin/contact/${contactId}?uid=${uid}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
          setFilteredContacts(prevFiltered => prevFiltered.filter(contact => contact.id !== contactId));
          console.log('Contact deleted successfully');
        } else {
          console.error('Error deleting contact:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  return (
    <div className="container-contact">
      <div className="contacts">
        <h1 className='h1-con'>Contact Page</h1>

        {/* Search Bar */}
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

        {/* Button to download CSV */}
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
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Location</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th> {/* New Actions Column */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <tr key={index}>
                    <td>{contact.fullName}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phoneNumber}</td>
                    <td>{contact.location}</td>
                    <td>{contact.message}</td>
                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(contact.id)} 
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          backgroundColor: 'red',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No contacts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContactTwo;
