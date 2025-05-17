// src/utils/api.js
const IS_DEV = import.meta.env.MODE === 'development';
const BASE_URL = IS_DEV
  ? 'http://localhost:8000' // dev: Vite proxy to local FastAPI
  : 'https://sinatra.up.railway.app'; // prod: call Railway directly

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return await res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return await res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed`);
  return await res.json();
}