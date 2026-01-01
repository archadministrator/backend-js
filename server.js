const express = require("express");
const app = express();

app.use(express.json());


// Sample DB
let todos = [
    {id: 1, title: "Learn Express", completed: false}, 
    {id: 2, title: "Learn Nodejs", completed: false},
    {id: 3, title: "Learn Github", completed: false}
];

// Get task by id
app.get("/todos/:id", (req, res)=>{
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) return res.status(404).json({message: "Task not found"});

    res.json(todo); 
});


// Add task
app.post("/todos", (req, res)=>{
    const {title} = req.body;
    
    if (!title) return res.status(400).json({message: "Title is required"});

    const newTask = {
        id: todos.length + 1,
        title, 
        completed: false
    };
    todos.push(newTask);

    res.status(201).json(newTask);
});


app.put("/todos/:id", (req, res)=>{
    const id = pasrseInt(req.params.id);
    const {title, completed} = req.body;

    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).json({mesasge: "Task not found!"});

    if (title != undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});


// Delete task
app.delete("/todos/:id", (req, res)=>{
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) return res.status(404).json({message: "Task not found!"});

    todos.splice(index, 1);

    res.status(204).send();
})


app.listen(3000, ()=>{
    console.log("Server is running good on http://localhost:3000");
})



