// API URL - Thay đổi nếu cần
const API_URL = 'http://localhost:3000/api/todos';
let todos = [];
let currentFilter = 'all';
let editingId = null;

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    // Enter để thêm todo
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
    });
});

// Load todos từ API
async function loadTodos() {
    try {
    const response = await fetch(API_URL);
    todos = await response.json();
    renderTodos();
    updateStats();
    } catch (error) {
    console.error('Lỗi khi tải todos:', error);
    document.getElementById('todoList').innerHTML = 
        '<div class="empty-state">Không thể kết nối đến server. Vui lòng kiểm tra lại.</div>';
    }
}

// Thêm todo mới
async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) return;
    
    try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    
    const newTodo = await response.json();
    todos.push(newTodo);
    input.value = '';
    renderTodos();
    updateStats();
    } catch (error) {
    console.error('Lỗi khi thêm todo:', error);
    alert('Không thể thêm todo. Vui lòng thử lại.');
    }
}

// Toggle hoàn thành
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
    });
    
    const updatedTodo = await response.json();
    todos = todos.map(t => t.id === id ? updatedTodo : t);
    renderTodos();
    updateStats();
    } catch (error) {
    console.error('Lỗi khi cập nhật todo:', error);
    }
}

// Bắt đầu edit
function startEdit(id) {
    editingId = id;
    renderTodos();
}

// Lưu edit
async function saveEdit(id) {
    const input = document.querySelector(`#edit-${id}`);
    const title = input.value.trim();
    
    if (!title) {
    cancelEdit();
    return;
    }
    
    try {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    
    const updatedTodo = await response.json();
    todos = todos.map(t => t.id === id ? updatedTodo : t);
    editingId = null;
    renderTodos();
    } catch (error) {
    console.error('Lỗi khi sửa todo:', error);
    }
}

// Hủy edit
function cancelEdit() {
    editingId = null;
    renderTodos();
}

// Xóa todo
async function deleteTodo(id) {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
    
    try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    updateStats();
    } catch (error) {
    console.error('Lỗi khi xóa todo:', error);
    }
}

// Lọc todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Cập nhật UI filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// Render todos
function renderTodos() {
    const filtered = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
    });
    
    const listEl = document.getElementById('todoList');
    
    if (filtered.length === 0) {
    const emptyMessage = currentFilter === 'all' 
        ? 'Chưa có công việc nào' 
        : currentFilter === 'active'
        ? 'Không có công việc đang làm'
        : 'Không có công việc hoàn thành';
    
    listEl.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
    }
    
    listEl.innerHTML = filtered.map(todo => {
    if (editingId === todo.id) {
        return `
        <div class="todo-item">
            <input type="text" id="edit-${todo.id}" class="todo-edit-input" value="${todo.title}" 
            onkeypress="if(event.key==='Enter') saveEdit(${todo.id}); if(event.key==='Escape') cancelEdit();" autofocus />
            <div class="actions">
            <button class="icon-btn save" onclick="saveEdit(${todo.id})">✓</button>
            <button class="icon-btn cancel" onclick="cancelEdit()">✕</button>
            </div>
        </div>
        `;
    }
    
    return `
        <div class="todo-item">
        <div class="checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.title}</span>
        <div class="actions">
            <button class="icon-btn edit" onclick="startEdit(${todo.id})">✏️</button>
            <button class="icon-btn delete" onclick="deleteTodo(${todo.id})">🗑️</button>
        </div>
        </div>
    `;
    }).join('');
}

// Cập nhật thống kê
function updateStats() {
    document.getElementById('totalCount').textContent = todos.length;
    document.getElementById('activeCount').textContent = todos.filter(t => !t.completed).length;
    document.getElementById('completedCount').textContent = todos.filter(t => t.completed).length;
}
