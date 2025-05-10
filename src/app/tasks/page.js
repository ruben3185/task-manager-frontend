'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '../../lib/api';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
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

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const loadTasks = async (token) => {
    try {
      const data = await taskService.getTasks(token);
      setTasks(data.tasks);
    } catch (err) {
      console.error('Error al cargar tareas', err.message);
    }
  };

  const validateTask = (task) => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!task.description.trim()) newErrors.description = 'La descripción es obligatoria';
    return newErrors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const validationErrors = validateTask(newTask);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const task = await taskService.createTask(token, newTask);
      setTasks([...tasks, task.task]);
      setNewTask({ title: '', description: '' });
      setErrors({});
      showAlert('Tarea creada exitosamente');
    } catch (err) {
      console.error('Error al crear tarea', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
      showAlert('Tarea eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar tarea', err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateTask(editTask);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const updated = await taskService.updateTask(token, editTask.id, editTask);
      setTasks(tasks.map((t) => (t.id === editTask.id ? updated.task : t)));
      setEditTask(null);
      setErrors({});
      showAlert('Tarea actualizada exitosamente');
    } catch (err) {
      console.error('Error al actualizar tarea', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {alertMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md shadow">
          {alertMessage}
        </div>
      )}

      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Mis Tareas</h2>

      {/* Crear tarea */}
      <form onSubmit={handleCreate} className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Crear tarea
        </button>
      </form>

      {/* Lista de tareas */}
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition duration-300">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-gray-800">{task.description}</p>
                  <span className="text-sm text-gray-700">Estado: {task.status}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setErrors({});
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-700">No hay tareas disponibles.</p>
        )}
      </ul>

      {/* Formulario para editar tarea */}
      {editTask && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-md shadow-lg w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900">Editar tarea</h3>

            <div>
              <input
                type="text"
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Título"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <input
                type="text"
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <select
              value={editTask.status}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
              <option value="en_progreso">En progreso</option>
            </select>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEditTask(null)}
                className="flex items-center gap-2 text-gray-700 hover:underline"
              >
                <FaTimes />
                Cancelar
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                <FaSave />
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
