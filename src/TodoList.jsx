import React, { useState } from 'react';
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function TodoList() {
  const [tasks, setTasks] = useState([
    "Eat Breakfast", "Take a shower", "Walk the dog", "Check emails", "Do coding",
    "Read a book", "Meditate", "Write notes", "Clean room", "Plan tomorrow", "Workout", "Prepare Summary"
  ]);
  const [newTask, setNewTask] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks(t => [...t, newTask]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    const globalIndex = indexOfFirstTask + index;
    const updatedTasks = tasks.filter((_, i) => i !== globalIndex);
    setTasks(updatedTasks);
  }

  function moveTaskUp(index) {
    const globalIndex = indexOfFirstTask + index;
    if (globalIndex > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[globalIndex], updatedTasks[globalIndex - 1]] =
        [updatedTasks[globalIndex - 1], updatedTasks[globalIndex]];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    const globalIndex = indexOfFirstTask + index;
    if (globalIndex < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[globalIndex], updatedTasks[globalIndex + 1]] =
        [updatedTasks[globalIndex + 1], updatedTasks[globalIndex]];
      setTasks(updatedTasks);
    }
  }

  return (
    <div className='to-do-list'>
      <h1>To-Do List</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          <IoAddCircle />
        </button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task, index) => (
            <tr key={index}>
              <td>{indexOfFirstTask + index + 1}</td>
              <td>{task}</td>
              <td>
                <button onClick={() => deleteTask(index)}><MdDelete /></button>
                <button onClick={() => moveTaskUp(index)}><FaAngleDoubleUp /></button>
                <button onClick={() => moveTaskDown(index)}><FaAngleDoubleDown /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MUI Pagination with arrows */}
      <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
    </div>
  );
}

export default TodoList;
