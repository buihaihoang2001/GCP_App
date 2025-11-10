import React, { useState } from "react";
import { sendNumber } from "../api";

export default function NumberForm() {
  const [number, setNumber] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendNumber(number);
      setResponse(`Gửi thành công: ${res.data}`);
    } catch (err) {
      setResponse("Lỗi khi gửi dữ liệu!");
      console.error(err);
    }
  };

  return (
    <div className="form-section">
      <h2>Nhập dữ liệu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập số..."
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button type="submit">Gửi</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
}