const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());  // נותן לפורט אחר במחשב לתקשר עם הפורט שנגדיר לתוכנית הזאת (במקרה הזה לפורט של הפרונט)
app.use(express.json());  // all request from json to JS object


let tasks = [
  { id: 1, text: 'Start to learn', done: true },
  { id: 2, text: 'Wash the floor', done: true }
];


// --- Routes ---

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const task = { id: Date.now(), text: req.body.text, done: false };
  tasks.push(task);
  res.json(task);
})


app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  let task = tasks.find(item => item.id === id);
  if (task) {
    task.done = !task.done;
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
})


app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(item => item.id !== id);
  res.json({ success: true });
})


app.listen(4000, () => console.log("Server running on http://localhost:4000"))
