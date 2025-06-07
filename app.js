const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const app = express();
const mongodb = require('./mongodb/mongodb.connect');

mongodb.connect();

app.use(express.json());

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
    res.send('express test');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;