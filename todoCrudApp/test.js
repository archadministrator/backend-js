// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Fake Database (trong thực tế có thể dùng MongoDB, PostgreSQL, etc.)
let todos = [
  { id: 1, title: 'Học Express.js', completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Xây dựng Todo App', completed: false, createdAt: new Date().toISOString() }
];
let nextId = 3;

// Routes

// GET - Lấy tất cả todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET - Lấy todo theo ID
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo không tìm thấy' });
  }
});

// POST - Tạo todo mới
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title không được để trống' });
  }
  
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Cập nhật todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo không tìm thấy' });
  }
  
  if (title !== undefined) {
    todos[todoIndex].title = title.trim();
  }
  
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }
  
  res.json(todos[todoIndex]);
});

// DELETE - Xóa todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo không tìm thấy' });
  }
  
  todos.splice(todoIndex, 1);
  res.json({ message: 'Đã xóa thành công', id });
});

// DELETE - Xóa tất cả todos đã hoàn thành
app.delete('/api/todos', (req, res) => {
  const beforeCount = todos.length;
  todos = todos.filter(t => !t.completed);
  const deletedCount = beforeCount - todos.length;
  
  res.json({ message: `Đã xóa ${deletedCount} todos`, deletedCount });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Hướng dẫn cài đặt và chạy:
// 1. Tạo thư mục project và cd vào đó
// 2. npm init -y
// 3. npm install express cors
// 4. Tạo file server.js và copy code này vào
// 5. Tạo thư mục public và đặt file index.html vào đó
// 6. node server.js hoặc nodemon server.js