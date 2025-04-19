const express = require('express');
const app = express();
const port = 3000; // tumhala je port number pahije, te use karu shakta.

// JSON body parsing sathi middleware
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Server suru kar
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
