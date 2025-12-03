// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { prisma } from './prisma'; // Importamos la conexión que acabamos de crear

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- RUTAS ---

// 1. Obtener todas las cartas
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await prisma.card.findMany();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cartas" });
  }
});

// 2. Obtener todos los paquetes (con sus cartas adentro)
app.get('/api/packs', async (req, res) => {
  try {
    const packs = await prisma.pack.findMany({
      include: {
        cards: true // ¡Esto es magia! Trae también las cartas de cada paquete
      }
    });
    res.json(packs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
});

// 3. Ping de prueba
app.get('/ping', (req, res) => {
  res.send('pong');
});


app.get('/api/packs', async (req, res) => {
  try {
    const packs = await prisma.pack.findMany();
    res.json(packs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
});

// --- ARRANCAR ---
app.listen(PORT, () => {
  console.log(`⚡ Servidor listo en http://localhost:${PORT}`);
  console.log(`🃏 Cartas disponibles en http://localhost:${PORT}/api/cards`);
});