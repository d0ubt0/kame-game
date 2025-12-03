import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaz para TypeScript basada en la API de Yu-Gi-Oh
interface YugiApiCard {
  id: number;
  name: string;
  type: string;    // Importante para saber si es Magia o Monstruo
  desc: string;
  atk?: number;
  def?: number;
  card_images: { image_url: string }[];
  card_prices: { cardmarket_price: string }[];
}

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Limpieza de Tablas (Orden importante por las relaciones)
  try {
    await prisma.userCard.deleteMany();
    await prisma.pack.deleteMany();
    await prisma.card.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Base de datos limpia.');
  } catch (error) {
    console.log('⚠️  Error limpiando (quizás estaba vacía), continuamos...');
  }

  // 2. Obtener Cartas de la API
  // Pedimos 150 para asegurarnos de tener suficientes monstruos después de filtrar
  const URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=150&offset=0';
  console.log(`🌍 Descargando datos de: ${URL}`);
  
  const response = await fetch(URL);
  const data = await response.json();
  const apiCards: YugiApiCard[] = data.data;

  // 3. Filtrar y Transformar
  // CONDICIÓN: Solo queremos Monstruos (Excluimos "Spell Card" y "Trap Card")
  const monstersOnly = apiCards.filter(card => card.type.includes("Monster"));
  
  console.log(`🔎 Se encontraron ${monstersOnly.length} monstruos (se descartaron las mágicas/trampas).`);

  const cardsToInsert = monstersOnly.map((card) => {
    // Convertir precio a entero
    const rawPrice = parseFloat(card.card_prices[0]?.cardmarket_price || "1");
    const intPrice = Math.floor(rawPrice * 1000); 

    return {
      id: card.id,
      name: card.name,
      description: card.desc,
      attack: card.atk || 0,
      defense: card.def || 0,
      price: intPrice,
      image: card.card_images[0].image_url
    };
  });

  // 4. Insertar Cartas en la DB
  await prisma.card.createMany({
    data: cardsToInsert,
    skipDuplicates: true
  });
  console.log('🃏 Cartas insertadas correctamente.');

  // 5. Crear Usuario ADMIN
  console.log('👤 Creando usuario Admin...');
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@kamegame.com',
      password: 'admin123', // En un caso real, esto debería estar encriptado (hash)
      role: 'admin',
      collection: { create: [] } // Admin no juega, no tiene cartas
    }
  });

  // 6. Crear Usuario DUELISTA (Con todas las cartas)
  console.log('👤 Creando usuario Duelista (Dueño de todo)...');
  
  // Preparamos la colección: Mapeamos CADA carta insertada para dársela al usuario
  const fullCollection = cardsToInsert.map(card => ({
    card: { connect: { id: card.id } },
    quantity: 3 // ¡Le damos 3 copias de cada carta!
  }));

  await prisma.user.create({
    data: {
      username: 'duelista',
      email: 'duelista@correo.com',
      password: '12345',
      role: 'cliente',
      collection: {
        create: fullCollection
      }
    }
  });

  console.log('✅ Seed finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });