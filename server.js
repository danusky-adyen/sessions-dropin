const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Cart endpoint to manage items
app.post('/cart', (req, res) => {
    // Cart management logic
    res.send('Cart endpoint');
});

// Adyen Sessions endpoint
app.post('/adyen/sessions', (req, res) => {
    // Logic for Adyen Sessions
    res.send('Adyen Sessions endpoint');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});