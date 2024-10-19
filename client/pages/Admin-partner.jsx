import React, { useEffect, useState } from 'react';

const AdminPartner = () => {
    const [partners, setPartners] = useState([]);
    const [uid] = useState('EyrEUxvYnVZueLMjvX3LOX7RHVb2'); // Assuming uid is constant
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch(`https://nikshoo-backend.vercel.app/admin/partner?uid=${uid}`);
                const data = await response.json();

                const partnersArray = Object.entries(data.partners).map(([id, partner]) => ({
                    id,
                    ...partner
                }));

                setPartners(partnersArray);
                setFilteredPartners(partnersArray);
            } catch (error) {
                console.error('Error fetching partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, [uid]);

    useEffect(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        const results = partners.filter((partner) => {
            return (
                partner.partnerName.toLowerCase().includes(normalizedSearchTerm) ||
                partner.email.toLowerCase().includes(normalizedSearchTerm) ||
                partner.phoneNumber.includes(normalizedSearchTerm) || // Search inside phone numbers
                partner.city.toLowerCase().includes(normalizedSearchTerm) ||
                partner.comments.toLowerCase().includes(normalizedSearchTerm) || // Search comments field
                (partner.documentUrl && partner.documentUrl.toLowerCase().includes(normalizedSearchTerm)) // Search documentUrl
            );
        });

        setFilteredPartners(results);
    }, [searchTerm, partners]);

    // Function to convert filteredPartners to CSV format
    const convertToCSV = (partners) => {
        const headers = ['Partner Name', 'Email', 'Phone Number', 'City', 'Comments', 'Document Name', 'Date'];

        const rows = partners.map((partner) => [
            partner.partnerName,
            partner.email,
            partner.phoneNumber,
            partner.city,
            partner.comments,
            partner.documentName,
            new Date(partner.createdAt).toLocaleDateString(),
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    };

    // Function to download CSV
    const downloadCSV = () => {
        const csvContent = convertToCSV(filteredPartners);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'partners.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to delete a partner
    const handleDelete = async (partnerId) => {
        if (window.confirm('Are you sure you want to delete this partner?')) {
            try {
                const response = await fetch(`https://nikshoo-backend.vercel.app/admin/partner/${partnerId}?uid=${uid}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setPartners(prevPartners => prevPartners.filter(partner => partner.id !== partnerId));
                    setFilteredPartners(prevFiltered => prevFiltered.filter(partner => partner.id !== partnerId));
                    console.log('Partner deleted successfully');
                } else {
                    console.error('Error deleting partner:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting partner:', error);
            }
        }
    };

    return (
        <div className="container-partner">
            <div className="partners">
                <h1 className='h1-con'>Partners</h1>

                {/* Search Bar */}
                <input
                    type="text"
                    className='search'
                    placeholder="Search partners..."
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
                                <th>Partner Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>City</th>
                                <th>Comments</th>
                                <th>Document Link</th>
                                <th>Date</th>
                                <th>Actions</th> {/* New Actions Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8">Loading...</td>
                                </tr>
                            ) : filteredPartners.length > 0 ? (
                                filteredPartners.map((partner, index) => (
                                    <tr key={index}>
                                        <td>{partner.partnerName}</td>
                                        <td>{partner.email}</td>
                                        <td>{partner.phoneNumber}</td>
                                        <td>{partner.city}</td>
                                        <td>{partner.comments}</td>
                                        <td>
                                            <a href={partner.documentUrl} target='_blank'>
                                                {partner.documentName}
                                            </a>
                                        </td>
                                        <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(partner.id)}
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
                                    <td colSpan="8">No partners found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPartner;
