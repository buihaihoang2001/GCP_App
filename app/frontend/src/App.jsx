import React, { useState, useEffect, useCallback, useMemo } from 'react';
const API_URL = "http://35.202.213.72:8000";

/**
 * Gửi một số lên backend.
 */
async function postNumber(value) {
  // Sử dụng URLSearchParams như file api.js gốc của bạn
  const res = await fetch(`${API_URL}/numbers`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ value }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Không thể gửi số.');
  }
  return res.json();
}

/**
 * Tải một file ảnh lên backend.
 */
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Không thể upload ảnh.');
  }
  return res.json();
}

/**
 * Lấy danh sách số và ảnh từ backend.
 */
async function fetchList() {
  const res = await fetch(`${API_URL}/list`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Không thể tải dữ liệu.');
  }
  return res.json();
}
// --- End API Configuration ---

// --- Component Thông Báo ---
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-down`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

// --- Component APP Chính ---
function App() {
  // State cho forms
  const [numberInput, setNumberInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Để xem trước ảnh

  // State cho dữ liệu
  const [numbersList, setNumbersList] = useState([]);
  const [imagesList, setImagesList] = useState([]);

  // State cho UI
  const [isLoading, setIsLoading] = useState({ number: false, image: false, list: true });
  const [notification, setNotification] = useState(null); // { message: '', type: 'success' | 'error' }

  // --- Hàm Hiển Thị Thông Báo ---
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Tự động ẩn sau 3 giây
  };

  // --- Hàm Tải Dữ Liệu ---
  const handleFetchList = useCallback(async () => {
    setImagesList([]);
    setIsLoading(prev => ({ ...prev, list: true }));
    try {
      const data = await fetchList();
      setNumbersList(data.numbers || []);
      
      // Đã sửa: Đảm bảo URL ảnh được tạo chính xác
      // Giả định backend phục vụ file tĩnh tại /uploads
      const imageUrls = (data.images || []).map(filename => 
        `${API_URL}/uploads/${filename}`
      );
      setImagesList(imageUrls);
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, list: false }));
    }
  }, []); // Thêm mảng phụ thuộc rỗng nếu API_URL là hằng số

  // --- Tải dữ liệu lần đầu khi component mount ---
  // Đã sửa: Không tự động gọi handleFetchList khi load trang (chỉ fetch khi user gửi/upload)
  // useEffect(() => {
  //   handleFetchList();
  // }, [handleFetchList]);

  // --- Xử lý sự kiện file input ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo URL tạm thời để xem trước
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clean up URL cũ để tránh rò rỉ bộ nhớ
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  // --- Xử lý Submit Form Số ---
  const handleSubmitNumber = async (e) => {
    e.preventDefault();
    if (!numberInput) return;

    setIsLoading(prev => ({ ...prev, number: true }));
    try {
      await postNumber(numberInput);
      showNotification('Gửi số thành công!', 'success');
      setNumberInput("");
      handleFetchList(); // Tải lại danh sách
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, number: false }));
    }
  };

  // --- Xử lý Submit Form Ảnh ---
  const handleSubmitImage = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(prev => ({ ...prev, image: true }));
    try {
      await uploadImage(selectedFile);
      showNotification('Upload ảnh thành công!', 'success');
      setSelectedFile(null);
      setImagePreview(null);
      handleFetchList(); // Tải lại danh sách
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, image: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-indigo-50 p-6 md:p-12 font-sans">
      <h1 className="text-xl font-semibold mb-8 text-center">DevOps Training</h1>

      <main className="w-full max-w-2xl flex flex-col items-center">
        {/* === FORM GỬI SỐ === */}
        <form onSubmit={handleSubmitNumber} className="w-full mb-6">
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="Nhập số của bạn..."
              className="flex-1 border border-gray-300 rounded-md p-2 text-base outline-none"
              disabled={isLoading.number}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={isLoading.number}
            >
              {isLoading.number ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>
        </form>

        {/* === KHUNG DANH SÁCH SỐ === */}
        <div className="border rounded-md p-4 mb-8 text-center text-gray-600 w-full">
          {isLoading.list && <p>Đang tải...</p>}
          {!isLoading.list && numbersList.length === 0 && <p>Chưa có dữ liệu.</p>}
          {!isLoading.list && numbersList.length > 0 && (
            <ul className="space-y-1">
              {numbersList.map((item, index) => (
                <li key={item.id || index} className="text-base">
                  {item.value.toString().replace(/[:].*$/, '')} - {new Date(item.created_at).toLocaleDateString('vi-VN')}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* === FORM UPLOAD ẢNH === */}
        <form onSubmit={handleSubmitImage} className="w-full flex flex-col space-y-4">
          <label className="text-base font-medium text-gray-700">Upload ảnh</label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="border border-gray-300 rounded-md p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 rounded-md disabled:opacity-50"
            disabled={isLoading.image || !selectedFile}
          >
            {isLoading.image ? 'Đang upload...' : 'Gửi'}
          </button>
        </form>

        {/* === Dòng chữ nhỏ nếu có ảnh === */}
        {imagesList.length > 0 && (
          <p className="text-sm text-gray-500 mt-4 w-full text-center">
            Ảnh đã được lưu vào hệ thống.
          </p>
        )}

        {/* === KHUNG REVIEW ẢNH === */}
        <div className="border rounded-md p-4 text-center mt-6 w-full">
          <h2 className="mb-4 font-medium text-gray-700">Review ảnh</h2>
          {isLoading.list && <p>Đang tải...</p>}
          {!isLoading.list && imagesList.length === 0 && (
            <p className="text-gray-500">Chưa có ảnh nào được tải lên.</p>
          )}
          {!isLoading.list && imagesList.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {imagesList.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Uploaded ${index}`}
                  className="w-full h-24 object-contain rounded-md border border-gray-300 bg-gray-50"
                  crossOrigin="anonymous"
                  onError={(e) => e.target.src = 'https://placehold.co/100x100/F0F0F0/CCC?text=Error'}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;