//  השינוי בקובץ זה בעקבות כך שהנתונים שמורים במסד נתונים של mongoDB ולא במערך מקומי 
// הוא שבכל מקום שהיה t.id השתנה ל t._id כי ב mongoDB כל אובייקט מקבל מזהה ייחודי בשם _id 


import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    const res = await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setText("");
  };

  const toggleDone = async (id) => {
    const res = await fetch(`http://localhost:4000/tasks/${id}`, { method: "PUT" });
    const updated = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div style={{ margin: 40 }}>
      <h2>My Tasks</h2>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="New task" />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <span
              onClick={() => toggleDone(t._id)}
              style={{
                textDecoration: t.done ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {t.text}
            </span>
            <span>{t.done ? '\t|\tdone\t' : '\t|\twait\t'}</span>
            <button onClick={() => deleteTask(t._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
