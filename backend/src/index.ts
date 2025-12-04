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

// 4. Endpoint de LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscamos el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    // Validamos: ¿Existe el usuario? ¿La contraseña coincide?
    // NOTA: En un proyecto real, aquí usaríamos bcrypt.compare(password, user.password)
    if (user && user.password === password) {
      // Devolvemos el usuario (sin la contraseña por seguridad)
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 5. Endpoint de REGISTRO
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const username = email.split('@')[0]; // Creamos un username basado en el correo

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // Recuerda: idealmente encriptar esto
        username,
        role: 'cliente',
        collection: { create: [] } // Empieza sin cartas
      }
    });
    
    // Devolvemos el usuario creado
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);

  } catch (error) {
    // Si falla (ej: email duplicado), Prisma lanza error P2002
    res.status(400).json({ error: "El usuario ya existe o datos inválidos" });
  }
});
// 3. CREAR una nueva carta (POST)
app.post('/api/cards', async (req, res) => {
  try {
    const { name, description, attack, defense, price, image } = req.body;
    
    const newCard = await prisma.card.create({
      data: {
        // No pasamos ID, dejamos que la base de datos lo genere (autoincrement)
        name,
        description,
        attack: Number(attack),
        defense: Number(defense),
        price: Number(price),
        image
      }
    });
    res.json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando la carta" });
  }
});

// 4. ACTUALIZAR una carta existente (PUT)
app.put('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, attack, defense, price, image } = req.body;

  try {
    const updatedCard = await prisma.card.update({
      where: { id: Number(id) }, // Importante: Convertir ID de string a número
      data: {
        name,
        description,
        attack: Number(attack),
        defense: Number(defense),
        price: Number(price),
        image
      }
    });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando la carta" });
  }
});

// 5. BORRAR una carta (DELETE)
app.delete('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Primero borramos las referencias en UserCard (si alguien la tiene en su mazo)
    // para evitar error de llave foránea
    await prisma.userCard.deleteMany({
      where: { cardId: Number(id) }
    });

    // Ahora sí borramos la carta
    await prisma.card.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: "Carta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando la carta" });
  }
});
// 6. OBTENER TODOS LOS USUARIOS (GET)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' } // Ordenados por ID
    });
    // Opcional: Podrías quitar el password antes de enviarlo
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
});

// 7. CREAR USUARIO (POST) - Desde el panel de admin
app.post('/api/users', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password, // Recuerda: idealmente encriptar
        role: role || 'cliente',
        collection: { create: [] }
      }
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Error creando usuario (quizás el email ya existe)" });
  }
});

// 8. ACTUALIZAR USUARIO (PUT)
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        email,
        password,
        role
      }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando usuario" });
  }
});

// 9. ELIMINAR USUARIO (DELETE)
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Primero borramos su colección de cartas (limpieza)
    await prisma.userCard.deleteMany({
      where: { userId: Number(id) }
    });

    // 2. Ahora borramos al usuario
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
});


// 10. CREAR PAQUETE (POST)
app.post('/api/packs', async (req, res) => {
  const { name, price, image, cards } = req.body; 
  // 'cards' se espera que sea un array de IDs (ej: ["1", "5", "20"])

  try {
    const newPack = await prisma.pack.create({
      data: {
        name,
        price: Number(price),
        image,
        // Conexión Mágica:
        cards: {
          // Mapeamos los IDs que vienen del front para conectarlos
          connect: cards.map((cardId: string | number) => ({ id: Number(cardId) }))
        }
      },
      include: { cards: true } // Devolvemos el paquete con sus cartas visibles
    });
    res.json(newPack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando el paquete" });
  }
});

// 11. ACTUALIZAR PAQUETE (PUT)
app.put('/api/packs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, image, cards } = req.body;

  try {
    const updatedPack = await prisma.pack.update({
      where: { id: Number(id) },
      data: {
        name,
        price: Number(price),
        image,
        // Actualización de Relación:
        cards: {
          // 'set' reemplaza todas las relaciones antiguas por esta nueva lista
          set: cards.map((cardId: string | number) => ({ id: Number(cardId) }))
        }
      },
      include: { cards: true }
    });
    res.json(updatedPack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando el paquete" });
  }
});

// 12. ELIMINAR PAQUETE (DELETE)
app.delete('/api/packs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Al borrar el paquete, Prisma automáticamente borra las relaciones 
    // en la tabla oculta intermedia, pero NO borra las cartas originales.
    await prisma.pack.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Paquete eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando el paquete" });
  }
});

// 13. OBTENER COLECCIÓN DE UN USUARIO (GET)
app.get('/api/users/:id/collection', async (req, res) => {
  const { id } = req.params;

  try {
    // Buscamos en la tabla intermedia 'UserCard'
    const collection = await prisma.userCard.findMany({
      where: { 
        userId: Number(id) 
      },
      include: {
        card: true // <--- ¡Esto es clave! Trae el nombre, imagen, ataque, etc.
      }
    });

    // La respuesta será un array tipo: [{ quantity: 2, card: {...} }, ...]
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo la colección" });
  }
});

// 14. PROCESAR COMPRA (Carrito)
app.post('/api/purchase', async (req, res) => {
  const { userId, items } = req.body;
  // items espera ser un array: [{ id: 1, type: 'card'|'pack', quantity: 1, name: "..." }, ...]

  if (!userId || !items) {
     res.status(400).json({ error: "Faltan datos de compra" });
     return; // Return explícito para evitar ejecución extra
  }

  try {
    // Usamos una transacción para asegurar que todas las cartas se guarden o ninguna
    await prisma.$transaction(async (tx) => {
      
      for (const item of items) {
        
        // CASO A: Compra de Carta Individual
        if (item.type === 'card') {
          await tx.userCard.upsert({
            where: { userId_cardId: { userId: Number(userId), cardId: Number(item.id) } },
            update: { quantity: { increment: item.quantity } },
            create: { userId: Number(userId), cardId: Number(item.id), quantity: item.quantity }
          });
        } 
        
        // CASO B: Compra de Paquete (El paquete contiene muchas cartas)
        else if (item.type === 'pack') {
          // 1. Buscamos qué cartas trae este paquete
          const pack = await tx.pack.findUnique({
            where: { id: Number(item.id) },
            include: { cards: true }
          });

          if (pack && pack.cards) {
            // 2. Por cada carta del paquete, se la damos al usuario
            for (const card of pack.cards) {
              // Si compras 2 paquetes, te dan 2 copias de cada carta interna
              const qtyToAdd = item.quantity; 

              await tx.userCard.upsert({
                where: { userId_cardId: { userId: Number(userId), cardId: card.id } },
                update: { quantity: { increment: qtyToAdd } },
                create: { userId: Number(userId), cardId: card.id, quantity: qtyToAdd }
              });
            }
          }
        }
      }
    });

    res.json({ success: true, message: "Compra procesada y colección actualizada" });

  } catch (error) {
    console.error("Error en compra:", error);
    res.status(500).json({ error: "Error procesando la compra en base de datos" });
  }
});

// --- ARRANCAR ---
app.listen(PORT, () => {
  console.log(`⚡ Servidor listo en http://localhost:${PORT}`);
  console.log(`🃏 Cartas disponibles en http://localhost:${PORT}/api/cards`);
});


