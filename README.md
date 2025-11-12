
#  Kame Game

Kame Game esta desarrollado con **React + Vite + TypeScript**.  
El proyecto usa **React Router** para la navegación y ESLint para mantener un código limpio y consistente.

Angel Efrain Pimienta Duran
Sergio Ahumada Ortiz
Sebastian Pabon Nuñez
Jorge Humberto Gaviria Botero


---

## Requisitos Previos
Antes de empezar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior  
- [npm](https://www.npmjs.com/) 

---

##  Instalación

Clona el repositorio y entra al directorio del proyecto
cd kame-game

Instala las dependencias
npm install

Ejecuta el proyecto
npm run dev

## Estructura del proyecto
kame-game/
├── public/               # Recursos estáticos
├── src/
│   ├── components/       # Componentes ordenados por carpetas
│   ├── context/          # Logica de inicio de sesión 
│   ├── db/               # Estructura de los datos y cargar la información 
│   ├── pages/            # Paginas construidas con los componentes
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada de la aplicación
│   └── router.tsx        # Configuración de rutas
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
