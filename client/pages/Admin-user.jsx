import React, { useEffect, useState } from "react";
import AdminPopUp from "../Components/AdminPopUp.jsx"; // Import the popup component

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [showPopup, setShowPopup] = useState(false); // State to show/hide the pop-up
  const [selectedRole, setSelectedRole] = useState(''); // State to store selected role

  const uid = 'EyrEUxvYnVZueLMjvX3LOX7RHVb2'; // Your uid

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://nikshoo-backend.vercel.app/admin/users?uid=${uid}`);
        const data = await response.json();
        setUsers(data); // Set users from API response
        setFilteredUsers(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [uid]);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const results = users.filter((user) => {
      return (
        user.email.toLowerCase().includes(normalizedSearchTerm) || // Search by email
        user.uid.toLowerCase().includes(normalizedSearchTerm) || // Search by username
        (user.isAdmin ? "true" : "false").includes(normalizedSearchTerm) // Search by admin status
      );
    });

    setFilteredUsers(results);
  }, [searchTerm, users]);

  // Function to open popup
  const handleAddUserClick = () => {
    setShowPopup(true);
  };

  // Function to close popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Function to change the role of a user
  const handleChangeRole = async (userUid, role) => {
    try {
      const response = await fetch('https://nikshoo-backend.vercel.app/admin/changeRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
          userId: userUid,
          role: role,
        }),
      });

      if (response.ok) {
        console.log('Role updated successfully');
        // Optionally update the UI based on the new role
        setUsers(users.map(user => user.uid === userUid ? { ...user, isAdmin: role === 'admin' } : user));
      } else {
        console.error('Error updating role:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="container-user">
      <h1 className='h1-con'>Users</h1>

      {/* Search Bar */}
      <input
        type="text"
        className='search'
        placeholder="Search users..."
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

      {/* Add User Button */}
      <button
        onClick={handleAddUserClick} // When clicked, show the pop-up
        style={{
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#09655b',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Add User
      </button>

      {/* Show pop-up when the state is true */}
      {showPopup && <AdminPopUp onClose={handleClosePopup} />} {/* Pass the close function */}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "True" : "False"}</td>
                <td>
                  {/* Directly render the select dropdown for role change */}
                  <select
                    value={user.isAdmin ? "admin" : "user"}
                    onChange={(e) => {
                      const role = e.target.value;
                      setSelectedRole(role);
                      handleChangeRole(user.uid, role); // Call function to change role
                    }}
                    style={{
                      padding: '5px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: '#23AA9B',
                      color: 'white',
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUser;
