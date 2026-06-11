import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (title, description) => {
    try {
      const res = await createTask({ title, description });
      setTasks((prev) => [res.data, ...prev]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
      throw err;
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Task Assistant</h1>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
      {error && <div className="error">{error}</div>}
      <TaskForm onSubmit={handleCreate} />
      {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDelete} />}
    </div>
  );
}

export default Dashboard;
