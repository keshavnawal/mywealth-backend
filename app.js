const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// ✅ Root route
app.get('/', (req, res) => {
  res.send("✅ MyWealth Backend is live.");
});

// ✅ Crypto Prices: BTC, ETH via CoinStats (INR)
app.get('/crypto', async (req, res) => {
  try {
    const coins = ['bitcoin', 'ethereum'];
    const prices = {};

    const { data } = await axios.get('https://api.coinstats.app/public/v1/coins?currency=INR');

    if (data.coins && Array.isArray(data.coins)) {
      coins.forEach(id => {
        const coin = data.coins.find(c => c.id === id);
        if (coin) prices[id] = coin.price;
      });
      return res.json(prices);
    } else {
      return res.status(500).json({ error: 'Invalid CoinStats response' });
    }
  } catch (error) {
    console.error('CoinStats fetch failed:', error.message);
    res.status(500).json({ error: 'Crypto fetch failed' });
  }
});

// ✅ Commodities: Gold & Silver (INR per oz)
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
    console.error('Metals API fetch failed:', error.message);
    res.status(500).json({ error: 'Commodities fetch failed' });
  }
});

// ✅ Mutual Funds NAV via AMFI India
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
    console.error('AMFI NAV fetch failed:', error.message);
    res.status(500).json({ error: 'AMFI fetch failed' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
