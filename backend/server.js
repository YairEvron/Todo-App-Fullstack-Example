const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();


const PORT = prosses.env.PORT || 4000;
const CONNECTION_URI = process.env.MONGO_URI;

const app = express();

app.use(cors());  // נותן לפורט אחר במחשב לתקשר עם הפורט שנגדיר לתוכנית הזאת (במקרה הזה לפורט של הפרונט)
app.use(express.json());  // all request from json to JS object

// connect to MongoDB Atlas
mongoose.connect(CONNECTION_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Could not connect to MongoDB...", err));


// Define Task schema
const taskSchema = new mongoose.Schema({
  text: String,
  done: {
    type: Boolean,
    default: false
  }
});


// Create Task model
const Task = mongoose.model("Task", taskSchema);

Task.create({ text: 'Start To Learn' })
Task.create({ text: 'Go to sleep' })


// --- Routes ---

// GET - שליפת כל המשימות 
app.get('/tasks', async (req, res) => {
  res.json(await Task.find())
});

// POST - יצירת משימה חדשה 
app.post('/tasks', async (req, res) => {
  const savedTask = await Task.create({ text: req.body.text });
  res.json(savedTask);
})

// PUT - עדכון משימה
app.put('/tasks/:id', async (req, res) => {
  let task = await Task.findById(req.params.id);
  if (task) {
    task.done = !task.done;
    await task.save();
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
})


// DELETE - מחיקת משימה 
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
})


app.listen(PORT, () => console.log("Server running on port " + PORT));
