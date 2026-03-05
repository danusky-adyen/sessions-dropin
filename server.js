const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { Client, CheckoutAPI } = require('@adyen/api-library');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new Client({ apiKey: process.env.ADYEN_API_KEY, environment: 'TEST' });
const checkoutAPI = new CheckoutAPI(client);

let cart = [];

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart', (req, res) => {
    const { id, name, price, quantity } = req.body;
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += quantity || 1;
    } else {
        cart.push({ id, name, price, quantity: quantity || 1 });
    }
    res.json(cart);
});

app.delete('/api/cart/:id', (req, res) => {
    cart = cart.filter(item => item.id !== req.params.id);
    res.json(cart);
});

app.post('/api/sessions', async (req, res) => {
    try {
        const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const amountInCents = Math.round(cartTotal * 100);
        const sessionRequest = {
            merchantAccount: process.env.MERCHANT_ACCOUNT,
            amount: { value: amountInCents, currency: 'USD' },
            reference: `ORDER-${Date.now()}`,
            returnUrl: 'http://localhost:3001/return',
            shopperLocale: 'en-US',
            channel: 'Web'
        };

        const response = await checkoutAPI.sessions(sessionRequest);
        res.json({ sessionId: response.id, sessionData: response.sessionData });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session', details: error.message });
    }
});

app.post('/api/payments/result', async (req, res) => {
    const { sessionResult } = req.body;
    try {
        console.log('Payment result received:', sessionResult);
        cart = [];
        res.json({ success: true });
    } catch (error) {
        console.error('Error handling payment result:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});