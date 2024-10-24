import React, { useEffect, useState } from "react";
import './Admin.css'; // Importing the CSS file
import { FaSpinner } from 'react-icons/fa';

const AdminImage = () => {
    const [images, setImages] = useState([]); // State for images to display
    const [selectedFiles, setSelectedFiles] = useState([]); // State for selected files
    const [isUploading, setIsUploading] = useState(false); // State to track uploading status
    const uid = 'EyrEUxvYnVZueLMjvX3LOX7RHVb2'; // Your uid

    // Function to fetch uploaded images
    const fetchImages = async () => {
        try {
            const response = await fetch(`https://nikshoo-backend.vercel.app/admin/images`);
            const data = await response.json();

            // Reorder the images based on the fileName
            const orderedImages = [
                data.find(img => img.fileName.includes("gallery1")),
                data.find(img => img.fileName.includes("gallery2")),
                data.find(img => img.fileName.includes("gallery3")),
                data.find(img => img.fileName.includes("gallery4")),
                data.find(img => img.fileName.includes("gallery5")),
            ].filter(Boolean); // Filter out any undefined images

            setImages(orderedImages); // Set ordered images
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImages(); // Fetch images on component mount
    }, []);

    // Function to handle file selection
    const handleFileChange = (event, imageName) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            handleEditImage(file, imageName); // Call handleEditImage immediately after selecting a file
        }
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

    // Function to edit an image
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

    // Function to trigger file input
    const triggerFileInput = (imageName) => {
        const fileInput = document.getElementById(`file-input-${imageName}`);
        if (fileInput) {
            fileInput.click(); // Simulate click to open file dialog
        }
    };

    // Function to extract gallery name from filename
    const getGalleryName = (fileName) => {
        const parts = fileName.split('-'); // Split the filename by hyphen
        return parts[parts.length - 1].split('.')[0]; // Take the last part and remove extension
    };

    return (
        <div className="container-user">
            <h2>Uploaded Images {isUploading && <FaSpinner className="spinner" />}</h2>
            
            {/* Display Images in Custom Grid Layout */}
            <div className="custom-grid">
                {/* Left Section - Full Height */}
                <div className="left-section">
                    {images[0] && (
                        <div className="gallery-image-container">
                            <img src={images[0].imageUrl} alt={images[0].fileName} />
                            <div className="overlay">
                                <span>{getGalleryName(images[0].fileName)}</span> {/* Display simplified name */}
                                <button onClick={() => triggerFileInput(images[0].fileName)}>Edit</button>
                                <input 
                                    type="file" 
                                    id={`file-input-${images[0].fileName}`} 
                                    style={{ display: 'none' }} 
                                    onChange={(e) => handleFileChange(e, images[0].fileName)} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Section - Split vertically into two halves */}
                <div className="right-section">
                    {/* Top Half */}
                    <div className="top-half">
                        {images[1] && (
                            <div className="gallery-image-container">
                                <img src={images[1].imageUrl} alt={images[1].fileName} />
                                <div className="overlay">
                                    <span>{getGalleryName(images[1].fileName)}</span> {/* Display simplified name */}
                                    <button onClick={() => triggerFileInput(images[1].fileName)}>Edit</button>
                                    <input 
                                        type="file" 
                                        id={`file-input-${images[1].fileName}`} 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileChange(e, images[1].fileName)} 
                                    />
                                </div>
                            </div>
                        )}
                        {images[2] && (
                            <div className="gallery-image-container">
                                <img src={images[2].imageUrl} alt={images[2].fileName} />
                                <div className="overlay">
                                    <span>{getGalleryName(images[2].fileName)}</span> {/* Display simplified name */}
                                    <button onClick={() => triggerFileInput(images[2].fileName)}>Edit</button>
                                    <input 
                                        type="file" 
                                        id={`file-input-${images[2].fileName}`} 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileChange(e, images[2].fileName)} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Half */}
                    <div className="bottom-half">
                        {images[3] && (
                            <div className="gallery-image-container">
                                <img src={images[3].imageUrl} alt={images[3].fileName} />
                                <div className="overlay">
                                    <span>{getGalleryName(images[3].fileName)}</span> {/* Display simplified name */}
                                    <button onClick={() => triggerFileInput(images[3].fileName)}>Edit</button>
                                    <input 
                                        type="file" 
                                        id={`file-input-${images[3].fileName}`} 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileChange(e, images[3].fileName)} 
                                    />
                                </div>
                            </div>
                        )}
                        {images[4] && (
                            <div className="gallery-image-container">
                                <img src={images[4].imageUrl} alt={images[4].fileName} />
                                <div className="overlay">
                                    <span>{getGalleryName(images[4].fileName)}</span> {/* Display simplified name */}
                                    <button onClick={() => triggerFileInput(images[4].fileName)}>Edit</button>
                                    <input 
                                        type="file" 
                                        id={`file-input-${images[4].fileName}`} 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileChange(e, images[4].fileName)} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <span className="span-grid">Note: When editing the image, ensure that the file is named exactly as specified in the image.</span>
            
        </div>
    );
};

export default AdminImage;
