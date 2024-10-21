import React, { useEffect, useState } from "react";
import './Admin.css'; // Importing the CSS file
import { FaSpinner } from 'react-icons/fa';

const AdminImage = () => {
    const [images, setImages] = useState([]); // State for images to display
    const [selectedFiles, setSelectedFiles] = useState([]); // State for selected files
    const [isUploading, setIsUploading] = useState(false); // State to track uploading status
    const [deletingFile, setDeletingFile] = useState(null); // State to track the file being deleted

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


    const handleEditImage = async (file, imageName) => {
        if (!file) return;

        setIsUploading(true); // Start uploading

        const formData = new FormData();
        formData.append('image', file); // Append the new file
        formData.append('rename', imageName); // Append the image name to rename

        try {
            const response = await fetch(`https://nikshoo-backend.vercel.app/admin/editImage?uid=${uid}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                console.log('Image replaced successfully');
                fetchImages(); // Refresh the image list after upload
            } else {
                console.error('Error editing image:', response.statusText);
            }
        } catch (error) {
            console.error('Error editing image:', error);
        }

        setIsUploading(false); // Stop uploading
    };

    // Function to delete an image
    const handleDeleteImage = async (fileName) => {
        // Ask user for confirmation before proceeding with deletion
        const userConfirmed = window.confirm("Are you sure you want to delete this image?");
        if (!userConfirmed) return; // Exit if user cancels

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
                {selectedFiles.length > 0 && (
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
                )}
            </div>

            <h2>Uploaded Images</h2>
            {/* Display Images in Cards */}
            <div className="image-cards-container images" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="image-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {images.length > 0 ? (
                        images.map((image, index) => {
                            const imageheading = image.fileName.split('-').pop().split('.')[0];
                            return (
                                <div key={index} className="image-card" style={{ position: 'relative' }}>
                                    <img src={image.imageUrl} alt={`Uploaded ${index}`} style={{ width: '100%', borderRadius: '5px' }} />

                                    <div className="overlay">
                                        <span className="image-name">{imageheading}</span>

                                        <input
                                            type="file"
                                            id={`file-input-${index}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                handleEditImage(e.target.files[0], image.fileName);
                                            }}
                                        />

                                        {/* Button to trigger file input */}
                                        <button
                                            className="edit"
                                            onClick={() => document.getElementById(`file-input-${index}`).click()}
                                        >
                                            Edit Image
                                        </button>

                                        <button
                                            onClick={() => handleDeleteImage(image.fileName)}
                                            disabled={deletingFile === image.fileName}
                                        >
                                            {deletingFile === image.fileName ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="loading-container">
                            <FaSpinner className="loading-icon imgone" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminImage;
