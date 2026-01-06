const express = require(express);
const app = express();

app.use(express.json());

// Sample DB
studentDatas = [
    {id: 1, name: 'Duong Van Huy', specialized: 'IT', gpa: '4.0'}, 
    {id: 2, name: 'Nguyen Van Han', specialized: 'IT', gpa: '3.2'}, 
    {id: 3, name: 'Doan Ngoc Hoi', specialized: 'CS', gpa: '3.2'}, 
    {id: 4, name: 'Ngo Trung Kien', specialized: 'IS', gpa: '2.9'}, 
    {id: 5, name: 'Chu Duc Minh', specialized: 'IS', gpa: '3.4'}, 
    {id: 6, name: 'Duong Canh Long', specialized: 'AI', gpa: '3.5'} 
]

app.get("/students", (req, res) => {
    
    
})