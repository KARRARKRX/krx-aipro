const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// 🧠 ربط الذكاء الصناعي
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: userMessage }]
    });

    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ reply: 'حدث خطأ في الاتصال بالذكاء الصناعي ❌' });
  }
});

// 📄 تقديم ملف index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
