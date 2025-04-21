
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/crypto', async (req, res) => {
  try {
    const coins = ['bitcoin', 'ethereum'];
    const prices = {};
    const response = await axios.get(`https://api.coincap.io/v2/assets`);
    response.data.data.forEach(asset => {
      if (coins.includes(asset.id)) {
        prices[asset.id] = parseFloat(asset.priceUsd);
      }
    });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Crypto fetch failed' });
  }
});

app.get('/commodities', async (req, res) => {
  try {
    const response = await axios.get('https://api.metals.live/v1/spot');
    let prices = { gold: 0, silver: 0 };
    response.data.forEach(row => {
      if (row.gold) prices.gold = row.gold;
      if (row.silver) prices.silver = row.silver;
    });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Commodities fetch failed' });
  }
});

app.get('/amfi', async (req, res) => {
  try {
    const response = await axios.get('https://www.amfiindia.com/spages/NAVAll.txt');
    const lines = response.data.split('\n');
    const navs = {};
    lines.forEach(line => {
      const parts = line.split(';');
      if (parts.length > 4 && !isNaN(parts[0])) {
        navs[parts[0]] = parseFloat(parts[4]);
      }
    });
    res.json(navs);
  } catch (error) {
    res.status(500).json({ error: 'AMFI fetch failed' });
  }
});

app.get('/', (req, res) => {
  res.send("MyWealth Backend is live.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
