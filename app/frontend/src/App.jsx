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

// --- Biểu tượng (Icons) ---
// Sử dụng inline SVG để có giao diện đẹp mà không cần thư viện ngoài
const SendIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009.5 16.571V11.5a1 1 0 011-1h.044a1 1 0 01.996.96l.04 2.016a1 1 0 001.992-.04l-.04-2.016A3 3 0 0010.044 9.5H10a3 3 0 00-3 3v5.071a1 1 0 00.925.992l5 1.429a1 1 0 001.17-1.409l-7-14z" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.33-2.33 3 3 0 013.75 5.25m-1.33 2.193C16.36 19.032 14.764 19.5 13.125 19.5h-6.375z" />
  </svg>
);

const DatabaseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5M3.75 12a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25m-16.5 5.25a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25m-16.5 5.25a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

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
  // Đã sửa: Đơn giản hóa logic, chỉ gọi handleFetchList
  useEffect(() => {
    handleFetchList();
  }, [handleFetchList]);

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

  // Đã xóa: Hàm getImageUrl không được sử dụng
  // Đã xóa: useEffect thứ hai bị trùng lặp logic

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 to-blue-100 p-6 md:p-12 font-sans">
      <h1 className="text-3xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 select-none">
        🚀 Demo DevOps
      </h1>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col space-y-10 border border-white">
        {/* === FORM GỬI SỐ === */}
        <section>
          <form onSubmit={handleSubmitNumber} className="flex flex-col space-y-4">
            <label className="text-xl font-semibold text-gray-700" htmlFor="number-input">
              📊 Gửi dữ liệu số
            </label>
            <div className="flex space-x-3">
              <input
                id="number-input"
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Nhập số của bạn..."
                className="flex-1 border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                disabled={isLoading.number}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center w-14 h-14"
                disabled={isLoading.number}
              >
                {isLoading.number ? <Spinner /> : <SendIcon className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </section>

        {/* === FORM UPLOAD ẢNH === */}
        <section>
          <form onSubmit={handleSubmitImage} className="flex flex-col space-y-4">
            <label className="text-xl font-semibold text-gray-700" htmlFor="file-upload">
              🖼️ Upload ảnh
            </label>

            {/* Vùng kéo-thả */}
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-all"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-4 h-4 mb-3 text-indigo-500" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Bấm để chọn</span> hoặc kéo thả
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (Tối đa 5MB)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>

            {/* Xem trước ảnh */}
            {imagePreview && (
              <div className="mt-2 text-center">
                <p className="font-semibold text-gray-600 mb-2">Xem trước:</p>
                <img
                  src={imagePreview}
                  alt="Xem trước"
                  className="mx-auto rounded-lg shadow-md max-h-36 max-w-36 object-contain rounded-xl border border-gray-300"
                  style={{ borderRadius: '0.5rem' }}
                />
                <p className="text-xs text-gray-500 mt-1">{selectedFile?.name}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center"
              disabled={isLoading.image || !selectedFile}
            >
              {isLoading.image ? <Spinner /> : 'Upload ảnh này'}
            </button>
          </form>
        </section>

        {/* === BẢNG DỮ LIỆU === */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Bảng dữ liệu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* --- Danh sách số --- */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center justify-center">
                <DatabaseIcon className="w-4 h-4 mr-2 text-indigo-500" />
                Số đã gửi
              </h3>
              <div className="bg-white rounded-lg shadow-inner max-h-60 overflow-y-auto p-4 border border-gray-200 w-full">
                {isLoading.list && <p className="text-gray-500 text-center">Đang tải...</p>}
                {!isLoading.list && numbersList.length === 0 && (
                  <p className="text-gray-500 text-center">Chưa có dữ liệu.</p>
                )}
                <ul className="divide-y divide-gray-100">
                  {numbersList.map((item, index) => (
                    <li key={item.id || index} className="py-3 flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-800">{item.value.toString().replace(/[:].*$/, '')}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* --- Danh sách ảnh --- */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                Ảnh đã upload
              </h3>
              <div className="bg-white rounded-lg shadow-inner max-h-80 overflow-y-auto p-4 border border-gray-200 w-full">
                {isLoading.list && <p className="text-gray-500 text-center">Đang tải...</p>}
                {!isLoading.list && imagesList.length === 0 && (
                  <p className="text-gray-500 text-center">Chưa có ảnh nào được tải lên.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagesList.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Uploaded ${index}`}
                      className="w-full h-32 object-contain rounded-lg border border-gray-200 bg-gray-50"
                      crossOrigin="anonymous"
                      // Thêm fallback phòng trường hợp ảnh bị lỗi
                      onError={(e) => e.target.src = 'https://placehold.co/100x100/F0F0F0/CCC?text=Error'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;