import React, { useState, useEffect } from 'react';

function App() {
  // States for task input and list of tasks
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Add task handler (POST request)
  const addTask = () => {
    if (task.trim() === '') return; // Don't add empty tasks

    // POST request to add a new task
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]); // Add the new task to the list
        setTask(''); // Clear the input field
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  // Delete task handler (DELETE request)
  const removeTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id)); // Remove task from the list
      })
      .catch((error) => console.error('Error removing task:', error));
  };

  // Toggle task completion handler (PUT request)
  const toggleCompletion = (id, currentStatus) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !currentStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: data.completed } : task
          )
        );
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              {task.task}
            </span>
            <button onClick={() => removeTask(task.id)}>Delete</button>
            <button onClick={() => toggleCompletion(task.id, task.completed)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

