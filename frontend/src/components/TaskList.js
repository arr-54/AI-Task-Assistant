import React from 'react';

function TaskList({ tasks, onStatusChange, onDelete }) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Category</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
              <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </td>
            <td className={`priority-${task.priority}`}>{task.priority || '-'}</td>
            <td>{task.category || '-'}</td>
            <td>{new Date(task.created_at).toLocaleDateString()}</td>
            <td>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this task?')) {
                    onDelete(task.id);
                  }
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaskList;