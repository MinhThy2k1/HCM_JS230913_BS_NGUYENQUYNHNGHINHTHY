/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Todolist.css";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const addTask = () => {
    if (newTask.trim() === "") return;

    if (editingTaskId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId ? { ...task, text: newTask } : task
      );
      setTasks(updatedTasks);
      setNewTask("");
      setEditingTaskId(null);
    } else {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const startEditingTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    setNewTask(task.text);
    setEditingTaskId(id);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    const updatedCompletedTasks = completedTasks.filter(
      (completedTaskId) => completedTaskId !== id
    );
    setCompletedTasks(updatedCompletedTasks);
  };

  const updateTask = (id, text, completed) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed } : task
    );
    setTasks(updatedTasks);

    if (completed) {
      setCompletedTasks([...completedTasks, id]);
    } else {
      const updatedCompletedTasks = completedTasks.filter(
        (completedTaskId) => completedTaskId !== id
      );
      setCompletedTasks(updatedCompletedTasks);
    }
  };

  useEffect(() => {
    // Load tasks and completed tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedCompletedTasks =
      JSON.parse(localStorage.getItem("completedTasks")) || [];

    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
    if (storedCompletedTasks.length > 0) {
      setCompletedTasks(storedCompletedTasks);
    }
  }, []);

  useEffect(() => {
    // Save tasks and completed tasks to localStorage whenever they change
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const numCompletedTasks = completedTasks.length;

  return (
    <div className="todolist_Container">
      <h3>Danh sách công việc</h3>
      <input
        type="text"
        placeholder="Nhập tên công việc"
        value={newTask}
        className="content"
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button className="btn btn-primary" type="button" onClick={addTask}>
        {editingTaskId !== null ? "Cập nhật" : "Thêm"}
      </button>
      <ul className="task_container">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <input
                className="inputtext"
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  updateTask(task.id, task.text, e.target.checked)
                }
              />
              <label className={task.completed ? "completed" : ""}>
                {task.text}
              </label>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  startEditingTask(task.id);
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
              </button>
              <button onClick={() => deleteTask(task.id)}>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </li>
          ))
        ) : (
          <li className="img_container">
            <img
              src="https://t4.ftcdn.net/jpg/05/86/21/03/360_F_586210337_WOGOw0l7raEB8F61Muc4hWbvVcyQdk9Z.jpg"
              alt="No tasks image"
              className="no-tasks-image"
            />
          </li>
        )}
      </ul>
      {numCompletedTasks === tasks.length && numCompletedTasks > 0 && (
        <div>
          <h3>Hoàn thành công việc</h3>
        </div>
      )}
      {numCompletedTasks !== tasks.length && (
        <div>
          <h3>
            Công việc chưa hoàn thành: {numCompletedTasks}/{tasks.length}
          </h3>
        </div>
      )}
    </div>
  );
}

export default TodoList;
