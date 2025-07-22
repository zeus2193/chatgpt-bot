const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
  res.send("🤖 Backend activo. Usa POST /chat");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Mensaje recibido:", userMessage);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y conciso." },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "🤷 Sin respuesta.";
    res.json({ reply });

  } catch (err) {
    console.error("❌ Error al conectar con OpenAI:");
    console.error(err.response?.data || err.message);
    res.status(500).json({ reply: `Error: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
