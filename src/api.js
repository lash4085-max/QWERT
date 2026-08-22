const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function signup(payload) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signin(payload) {
  return request("/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
