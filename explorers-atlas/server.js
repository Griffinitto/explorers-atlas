const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Proxy API for Stays (using a mock hotel API)
app.get('/api/stays', async (req, res) => {
    try {
        const response = await axios.get('https://api.npoint.io/4829a4c18a9c822b0e38'); // Mock hotel data
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stays' });
    }
});

// Proxy API for Eats (using a mock restaurant API)
app.get('/api/eats', async (req, res) => {
    try {
        const response = await axios.get('https://api.npoint.io/8fddf4f4f8c6e5a9f8e2'); // Mock restaurant data
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch eats' });
    }
});

// Proxy API for Guides (using GetYourGuide public API simulation)
app.get('/api/guides', async (req, res) => {
    try {
        const response = await axios.get('https://api.npoint.io/5f8e8e4e9c5f8e2d8f8e'); // Mock tour data
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 
