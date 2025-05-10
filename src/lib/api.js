// lib/api.js
export const fetchData = async (method, url, token, body = null) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) return data;
    console.error('Error al procesar la solicitud:', data);
    return null;
  } catch (error) {
    console.error('Error de red:', error);
    return null;
  }
};

export const fetchTasks = async (token) => {
  return await fetchData('GET', 'http://localhost:5000/api/tasks', token);
};

export const createTask = async (token, newTask) => {
  return await fetchData('POST', 'http://localhost:5000/api/tasks', token, newTask);
};

export const deleteTask = async (token, taskId) => {
  return await fetchData('DELETE', `http://localhost:5000/api/tasks/${taskId}`, token);
};
