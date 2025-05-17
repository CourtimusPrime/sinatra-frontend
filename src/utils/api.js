// src/utils/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiGet(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    ...options,
  });

  if (!res.ok) throw new Error(`GET ${path} failed`);
  return await res.json();
}

export async function apiPost(path, body, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) throw new Error(`POST ${path} failed`);
  return await res.json();
}

export async function apiDelete(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
    ...options,
  });

  if (!res.ok) throw new Error(`DELETE ${path} failed`);
  return await res.json();
}