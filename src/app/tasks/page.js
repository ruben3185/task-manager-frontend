'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
    } else {
      setToken(savedToken)
      fetchTasks(savedToken)
    }
  }, [router]);

  // Función genérica para hacer solicitudes API
  const fetchData = async (method, url, token, body = null) => {
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

      if (response.ok) {
        return data;
      } else {
        console.error('Error al procesar la solicitud:', data);
        return null;
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const fetchTasks = async (token) => {
    const data = await fetchData('GET', 'http://localhost:5000/api/tasks', token);
    if (data) setTasks(data.tasks);
  };

  const createTask = async (e) => {
    e.preventDefault();
    const data = await fetchData('POST', 'http://localhost:5000/api/tasks', token, newTask);
    if (data) {
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '' });
    }
  };

  const deleteTask = async (taskId) => {
    const data = await fetchData('DELETE', `http://localhost:5000/api/tasks/${taskId}`, token);
    if (data) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Mis Tareas</h2>

      <form onSubmit={createTask} className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear tarea
        </button>
      </form>

      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="p-4 border border-gray-300 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <p>No hay tareas disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default TasksPage;
