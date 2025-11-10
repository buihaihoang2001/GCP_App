import React, { useState } from "react";
import "./App.css";
import NumberForm from "./components/NumberForm";
import ImageUploader from "./components/ImageUploader";

function App() {
  const [number, setNumber] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleNumberSubmit = (e) => {
    e.preventDefault();
    console.log("Send numer:", number);
    // Gọi API backend tại đây, ví dụ:
    // fetch(`${API_URL}/numbers`, { method: "POST", body: JSON.stringify({ number }) })
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn ảnh!");
    console.log("Upload ảnh:", file.name);
    // Gọi API upload ảnh tại đây
    // Sau khi upload xong, có thể hiển thị ảnh đã upload:
    const imgUrl = URL.createObjectURL(file);
    setUploadedImage(imgUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-2">🚀 Upload Demo</h1>

      {/* --- Nhập số --- */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Gửi dữ liệu số</h2>
        <form onSubmit={handleNumberSubmit} className="flex space-x-2">
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Nhập số..."
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-4 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Gửi
          </button>
        </form>
      </div>

      {/* --- Upload ảnh --- */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🖼️ Upload ảnh</h2>
        <form onSubmit={handleImageUpload} className="space-y-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-gray-700"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Upload
          </button>
        </form>

        {uploadedImage && (
          <div className="mt-4 text-center">
            <p className="font-semibold text-gray-700 mb-2">Ảnh đã upload:</p>
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="mx-auto rounded-lg shadow-md max-h-64"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;