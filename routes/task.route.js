const express = require("express");
const taskroutes = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { createTask, getTasks, updateTask, deleteTask, getTaskStats } = require("../controllers/task.controller");

// Create Task
taskroutes.post("/createTask", authMiddleware, createTask);

// Get All Tasks
taskroutes.post("/getAllTasks", authMiddleware, getTasks);

// Get Single Task
//taskroutes.get("/:id", authMiddleware, getTaskById);

// Update Task
taskroutes.put("/updateTasks", authMiddleware, updateTask);

// Delete Task
taskroutes.put("/deleteTasks", authMiddleware, deleteTask);

// Get Stats Task Count
taskroutes.get("/getTaskStats", authMiddleware, getTaskStats);

module.exports = taskroutes;