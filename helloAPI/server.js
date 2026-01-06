const express = require("express");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello World (from Express)",
        status: "success"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running good on http://localhost:${PORT}`)
});