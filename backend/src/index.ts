import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./prisma";
import { TokenService } from "./tokenService";
import { authMiddleware, AuthRequest } from "./authMiddleware";
import { PasswordService } from "./passwordService";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// --- RUTAS PÚBLICAS ---

app.get("/api/cards", async (req, res) => {
  try {
    const cards = await prisma.card.findMany();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cartas" });
  }
});

app.get("/api/packs", async (req, res) => {
  try {
    const packs = await prisma.pack.findMany({ include: { cards: true } });
    res.json(packs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (
      user &&
      (await PasswordService.isSamePassword(password, user.password))
    ) {
      const { password, ...userWithoutPassword } = user;
      const token = TokenService.generateAccessToken(userWithoutPassword);
      res.json({ ...userWithoutPassword, token });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const username = email.split("@")[0];

  const hashedPassword = await PasswordService.hashPassword(password);

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: "cliente",
        collection: { create: [] },
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: "El usuario ya existe o datos inválidos" });
  }
});

// --- RUTAS PROTEGIDAS ---

// CARTAS
app.post("/api/cards", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, description, attack, defense, price, image } = req.body;
    const newCard = await prisma.card.create({
      data: {
        name,
        description,
        attack: Number(attack),
        defense: Number(defense),
        price: Number(price),
        image,
      },
    });
    res.json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando la carta" });
  }
});

app.put("/api/cards/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, description, attack, defense, price, image } = req.body;

  try {
    const updatedCard = await prisma.card.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        attack: Number(attack),
        defense: Number(defense),
        price: Number(price),
        image,
      },
    });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando la carta" });
  }
});

app.delete("/api/cards/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.userCard.deleteMany({ where: { cardId: Number(id) } });
    await prisma.card.delete({ where: { id: Number(id) } });
    res.json({ message: "Carta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando la carta" });
  }
});

// USUARIOS
app.get("/api/users", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
});

app.post("/api/users", authMiddleware, async (req: AuthRequest, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = await PasswordService.hashPassword(password);
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "cliente",
        collection: { create: [] },
      },
    });
    res.json(newUser);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error creando usuario (quizás el email ya existe)" });
  }
});

app.put("/api/users/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const hashedPassword = await PasswordService.hashPassword(password);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { username, email, password: hashedPassword, role },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando usuario" });
  }
});

app.delete("/api/users/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.userCard.deleteMany({ where: { userId: Number(id) } });
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando usuario" });
  }
});

// PAQUETES
app.post("/api/packs", authMiddleware, async (req: AuthRequest, res) => {
  const { name, price, image, cards } = req.body;
  try {
    const newPack = await prisma.pack.create({
      data: {
        name,
        price: Number(price),
        image,
        cards: {
          connect: cards.map((c: string | number) => ({ id: Number(c) })),
        },
      },
      include: { cards: true },
    });
    res.json(newPack);
  } catch (error) {
    res.status(500).json({ error: "Error creando el paquete" });
  }
});

app.put("/api/packs/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, price, image, cards } = req.body;
  try {
    const updatedPack = await prisma.pack.update({
      where: { id: Number(id) },
      data: {
        name,
        price: Number(price),
        image,
        cards: { set: cards.map((c: string | number) => ({ id: Number(c) })) },
      },
      include: { cards: true },
    });
    res.json(updatedPack);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando el paquete" });
  }
});

app.delete("/api/packs/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.pack.delete({ where: { id: Number(id) } });
    res.json({ message: "Paquete eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando el paquete" });
  }
});

// COLECCIÓN DEL USUARIO
app.get(
  "/api/users/collection",
  authMiddleware,
  async (req: AuthRequest, res) => {
    const id = req.user!.id;
    try {
      // Buscamos en la tabla intermedia 'UserCard'
      const collection = await prisma.userCard.findMany({
        where: {
          userId: Number(id),
        },
        include: {
          card: true, // <--- ¡Esto es clave! Trae el nombre, imagen, ataque, etc.
        },
      });

      // La respuesta será un array tipo: [{ quantity: 2, card: {...} }, ...]
      res.json(collection);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo la colección" });
    }
  }
);

// PROCESAR COMPRA
app.post("/api/purchase", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { items } = req.body;

  if (!items) return res.status(400).json({ error: "Faltan datos de compra" });

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.type === "card") {
          await tx.userCard.upsert({
            where: { userId_cardId: { userId, cardId: Number(item.id) } },
            update: { quantity: { increment: item.quantity } },
            create: {
              userId,
              cardId: Number(item.id),
              quantity: item.quantity,
            },
          });
        } else if (item.type === "pack") {
          const pack = await tx.pack.findUnique({
            where: { id: Number(item.id) },
            include: { cards: true },
          });
          if (pack?.cards) {
            for (const card of pack.cards) {
              await tx.userCard.upsert({
                where: { userId_cardId: { userId, cardId: card.id } },
                update: { quantity: { increment: item.quantity } },
                create: { userId, cardId: card.id, quantity: item.quantity },
              });
            }
          }
        }
      }
    });
    res.json({
      success: true,
      message: "Compra procesada y colección actualizada",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error procesando la compra en base de datos" });
  }
});

// --- ARRANCAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`⚡ Servidor listo en http://localhost:${PORT}`);
});
