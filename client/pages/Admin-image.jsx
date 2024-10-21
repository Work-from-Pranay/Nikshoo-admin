import React, { useEffect, useState } from "react";
import './Admin.css'; // Importing the CSS file
import { FaSpinner } from 'react-icons/fa';


const AdminImage = () => {
    const [images, setImages] = useState([]); // State for images to display
    const [selectedFiles, setSelectedFiles] = useState([]); // State for selected files
    const [isUploading, setIsUploading] = useState(false); // State to track uploading status
    const [deletingFile, setDeletingFile] = useState(null); // State to track the file being deleted
    const [editingFileName, setEditingFileName] = useState(null); // State for the file being edited
    const [newFileName, setNewFileName] = useState(''); // State for new file name input

    const uid = 'EyrEUxvYnVZueLMjvX3LOX7RHVb2'; // Your uid

    // Function to fetch uploaded images
    const fetchImages = async () => {
        try {
            const response = await fetch(`https://nikshoo-backend.vercel.app/admin/images`);
            const data = await response.json();
            setImages(data); // Set images from API response
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImages(); // Fetch images on component mount
    }, []);

    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]); // Update selected files state
    };

    // Function to upload images
    const handleUploadImages = async () => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        setIsUploading(true); // Start uploading

        const formData = new FormData();
        Array.from(selectedFiles).forEach(file => {
            formData.append('images', file);
            formData.append('renames', file.name); // Include image name 
        });

        try {
            const response = await fetch(`https://nikshoo-backend.vercel.app/admin/uploadImages?uid=${uid}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Images uploaded successfully');
                setSelectedFiles([]); // Clear selected files after upload
                fetchImages(); // Fetch images again to update the UI
            } else {
                console.error('Error uploading images:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }

        setIsUploading(false); // Stop uploading
    };

    // Function to delete an image
    const handleDeleteImage = async (fileName) => {
        setDeletingFile(fileName); // Set the file being deleted

        try {
            const response = await fetch('https://nikshoo-backend.vercel.app/admin/deleteImage', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageName: fileName }), // Use imageName as per your requirement
            });

            if (response.ok) {
                console.log('Image deleted successfully');
                fetchImages(); // Fetch images again to update the UI
            } else {
                console.error('Error deleting image:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }

        setDeletingFile(null); // Reset deletion status
    };

    // Function to submit the new name
    const handleSubmitNewName = async (e) => {
        e.preventDefault();
        if (!newFileName) return; // Do not submit if the new name is empty

        try {
            const response = await fetch('https://nikshoo-backend.vercel.app/admin/editImage', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageName: editingFileName, // Current image name
                    newName: newFileName // New name input by the user
                }),
            });

            if (response.ok) {
                console.log('Image name updated successfully');
                fetchImages(); // Fetch images again to update the UI
            } else {
                console.error('Error updating image name:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating image name:', error);
        }

        setEditingFileName(null); // Reset editing status
        setNewFileName(''); // Clear the input field
    };

    return (
        <div className="container-user">
            {/* Image Upload Form */}
            <div className="image-upload-form" style={{ marginBottom: '20px' }}>
                <h2>Upload Images</h2>
                <div className="upload-container">
                    <label className="file-upload-label">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="file-upload-input"
                        />
                        Choose Files
                    </label>

                    {selectedFiles.length > 0 && (
                        <div className="file-info">
                            {Array.from(selectedFiles).map((file, index) => (
                                <div key={index} className="file-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                    <span style={{ marginRight: '10px' }}>{file.name}</span>
                                    <button className="remove-file-btn" onClick={() => {
                                        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                    }} style={{
                                        padding: '5px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '5px'
                                    }}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUploadImages}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#09655b',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px',
                    }}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            <h2>Uploaded Images</h2>
            {/* Display Images in Cards */}
            <div className="image-cards-container images" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="image-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <div key={index} className="image-card" style={{ position: 'relative' }}>
                                <img src={image.imageUrl} alt={`Uploaded ${index}`} style={{ width: '100%', borderRadius: '5px' }} />
                                <div className="overlay">
                                    <span className="image-name">{image.fileName}</span>
                                    <button
                                        onClick={() => {
                                            setEditingFileName(image.fileName);
                                            setNewFileName(''); // Reset input on edit
                                        }}
                                        className="edit"
                                    >
                                        Edit Name
                                    </button>
                                    <button onClick={() => handleDeleteImage(image.fileName)} disabled={deletingFile === image.fileName}>
                                        {deletingFile === image.fileName ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="loading-container">
                            <FaSpinner className="loading-icon imgone" />
                        </div>
                    )}
                </div>
            </div>

            {/* Popup Form for Editing Image Name */}
            {editingFileName && (
                <div className="popup-form">
                    <div className="form-container">
                        <h3>Edit Image Name</h3>
                        <form onSubmit={handleSubmitNewName}>
                            <input
                                type="text"
                                placeholder="New Image Name"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setEditingFileName(null)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminImage;
