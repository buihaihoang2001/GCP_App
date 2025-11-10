import React, { useState } from "react";
import { uploadImage } from "../api";

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn ảnh!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      setUploadedUrl(res.data.url || "Tải lên thành công!");
    } catch (err) {
      console.error(err);
      alert("Upload thất bại!");
    }
  };

  return (
    <div className="upload-section">
      <h2>Tải ảnh lên</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {uploadedUrl && (
        <div className="image-preview">
          <img src={uploadedUrl} alt="Uploaded" />
        </div>
      )}
    </div>
  );
}