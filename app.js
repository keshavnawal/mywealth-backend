
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/crypto', async (req, res) => {
  try {
    const coins = ['bitcoin', 'ethereum'];
    const prices = {};

    const response = await axios.get('https://api.coinstats.app/public/v1/coins?currency=INR');
    const coinsData = response.data.coins;

    coins.forEach(id => {
      const match = coinsData.find(c => c.id === id);
      if (match) prices[id] = match.price;
    });

    res.json(prices);
  } catch (error) {
    console.error("Crypto fetch error:", error.message);
    res.status(500).json({ error: "Crypto fetch failed" });
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
