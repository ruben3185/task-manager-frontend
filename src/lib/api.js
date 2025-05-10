const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiRequest = async (method, endpoint, token = null, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();
    if (res.status === 401) {
      localStorage.clear();
      if (onUnauthorized) onUnauthorized();
      return;
    }

    if (!res.ok) throw new Error(data?.message || 'Error en la solicitud');
    return data;
  } catch (err) {
    
    console.error(`API ${method} ${endpoint}:`, err.message);
    throw err;
  }
};


// lib/services/taskService.js

export const taskService = {
  getTasks: (token) =>
    apiRequest('GET', '/tasks', token),

  createTask: (token, taskData) =>
    apiRequest('POST', '/tasks', token, taskData),

  deleteTask: (token, id) =>
    apiRequest('DELETE', `/tasks/${id}`, token),

  updateTask: (token, id, taskData) =>
    apiRequest('PUT', `/tasks/${id}`, token, taskData),
};
