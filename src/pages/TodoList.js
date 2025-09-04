import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdDownload } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

function TodoList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const tasksPerPage = 5;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/users');
        const data = response.data?.data || [];

        const mappedTasks = data.map(user => ({
          id: user.id,
          text: user.name
        }));

        setTasks(mappedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedTasks = sortOrder
    ? [...filteredTasks].sort((a, b) =>
        sortOrder === 'asc'
          ? a.text.localeCompare(b.text)
          : b.text.localeCompare(a.text)
      )
    : [...filteredTasks];

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  const handleInputChange = (e) => setNewTask(e.target.value);
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks([...tasks, { id: newId, text: newTask.trim() }]);
      setNewTask("");
    }
  };

  const deleteTask = (index) => {
    const taskId = currentTasks[index].id;
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
  };

  const handleEditChange = (e) => {
    setEditedText(e.target.value);
  };

  const saveEdit = (taskId) => {
    if (editedText.trim() !== "") {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, text: editedText.trim() } : task
      );
      setTasks(updatedTasks);
    }
    setEditingTaskId(null);
    setEditedText("");
  };

  const handleBlur = (taskId) => saveEdit(taskId);

  const handleKeyPress = (e, taskId) => {
    if (e.key === 'Enter') saveEdit(taskId);
  };

  const handleDownloadSingleTask = (task, index) => {
    const data = [{ SNo: indexOfFirstTask + index + 1, Task: task.text }];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const filename = `Task_${task.text.replace(/\s+/g, "_")}.xlsx`;
    saveAs(blob, filename);
  };

  const handleDownloadAllTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/download', {
        responseType: 'blob'
      });

      const text = await response.data.text();
      const lines = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => line.split(','));

      const jsonData = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = row[index] ? row[index].trim() : '';
        });
        return obj;
      });

      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All_Users");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "All_Users.xlsx");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="to-do-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>To-Do List</h1>
        <button onClick={() => navigate('/orgchart')} style={{ padding: '5px 10px', background: '#009AEE', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
          View Org Chart
        </button>
        <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#e63946', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">Error loading tasks: {error}</p>}

      {!loading && !error && (
        <>
          <div className="input-section" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search task..."
              value={searchText}
              onChange={handleSearchChange}
              style={{ flex: '1 1 200px' }}
            />
            <input
              type="text"
              placeholder="Enter a task..."
              value={newTask}
              onChange={handleInputChange}
              style={{ flex: '2 1 300px' }}
            />
            <button className="add-button" onClick={addTask}>
              <IoAddCircle />
            </button>
            <button className="add-button" onClick={handleDownloadAllTasks}>
              <MdDownload />
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>
                  Task
                  <button onClick={toggleSortOrder} className="sort-button">
                    {sortOrder === 'asc' ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
                  </button>
                </th>
                <th>Delete</th>
                <th>Edit</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{indexOfFirstTask + index + 1}</td>
                  <td>
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editedText}
                        onChange={handleEditChange}
                        onBlur={() => handleBlur(task.id)}
                        onKeyPress={(e) => handleKeyPress(e, task.id)}
                        autoFocus
                      />
                    ) : (
                      task.text
                    )}
                  </td>
                  <td>
                    <button onClick={() => deleteTask(index)}>
                      <MdDelete />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => startEditing(task)}>
                      <FiEdit />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDownloadSingleTask(task, index)}>
                      <MdDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}
    </div>
  );
}

export default TodoList;