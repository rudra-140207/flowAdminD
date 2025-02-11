import React, { useState } from "react";
import axios from "axios";

const AddImage = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkdce4jxr/image/upload";
  // const backendUrl = "http://localhost:5000";
  const backendUrl = "https://kiet-display-backend.onrender.com";

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image || !name.trim()) {
      showToastMessage("Please enter a name and select an image.", "error");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowToast(false);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "kietDisplay");
    formData.append("folder", "kiet");
    formData.append("resource_type", "image");

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const uploadedImageUrl = res.data.secure_url;
      setImageUrl(uploadedImageUrl);

      await uploadImageToDatabase(name, uploadedImageUrl);
      setLoading(false);
    } catch (err) {
      showToastMessage("Failed to upload image. Please try again.", "error");
      setLoading(false);
    }
  };

  const uploadImageToDatabase = async (name, url) => {
    try {
      await axios.post(`${backendUrl}/api/images`, { name, imageUrl: url });
      showToastMessage("Image uploaded successfully!", "success");
    } catch (error) {
      showToastMessage("Failed to save image in the database.", "error");
    }
  };

  const showToastMessage = (message, type) => {
    if (type === "error") setErrorMessage(message);
    else setSuccessMessage(message);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-4">Add Image</h1>

      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md text-white ${
            successMessage ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-1/2 mt-4" />}

      <input
        type="text"
        placeholder="Enter Image Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="file"
        onChange={handleImageChange}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default AddImage;