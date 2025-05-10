'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '../../lib/api';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
    } else {
      setToken(savedToken);
      loadTasks(savedToken);
    }
  }, [router]);

  const loadTasks = async (token) => {
    try {
      const data = await taskService.getTasks(token);
      setTasks(data.tasks);
    } catch (err) {
      console.error('Error al cargar tareas', err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const task = await taskService.createTask(token, newTask);
      setTasks([...tasks, task.task]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error('Error al crear tarea', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar tarea', err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await taskService.updateTask(token, editTask.id, editTask);
      setTasks(tasks.map((t) => (t.id === editTask.id ? updated.task : t)));
      setEditTask(null);
    } catch (err) {
      console.error('Error al actualizar tarea', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Mis Tareas</h2>

      <form onSubmit={handleCreate} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Título"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Crear tarea
        </button>
      </form>

      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <span className="text-sm text-gray-600">Estado: {task.status}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditTask(task)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No hay tareas disponibles.</p>
        )}
      </ul>

      {/* Formulario para editar tarea */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold">Editar tarea</h3>
            <input
              type="text"
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Título"
            />
            <input
              type="text"
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Descripción"
            />
            <select
              value={editTask.status}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
              <option value="en_progreso">progreso</option>

            </select>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEditTask(null)}
                className="text-gray-600 hover:underline"
              >
                Cancelar
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
