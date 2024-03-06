
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//
app.get('/api/digimons', async (req, res) => {
    try {
        const response = await axios.get('https://digimon-api.vercel.app/api/digimon');
        const digimons = response.data;
        res.json(digimons);
    }catch (error){
        res.status(500).json({ error: 'Error al obtener digimons.'});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});