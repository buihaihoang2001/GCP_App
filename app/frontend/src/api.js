const API_URL = process.env.REACT_APP_API_URL || "http://demo-backend.demo.svc.cluster.local:8000";

export async function postNumber(value) {
  const res = await fetch(`${API_URL}/numbers`, {
    method: "POST",
    body: new URLSearchParams({ value }),
  });
  return res.json();
}

export const sendNumber = postNumber;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
  return res.json();
}

export async function fetchList() {
  const res = await fetch(`${API_URL}/list`);
  return res.json();
}