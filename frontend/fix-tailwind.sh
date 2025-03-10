#!/bin/bash

echo "🔍 Diagnóstico y corrección de Tailwind CSS"
echo "==========================================="

# Verificar postcss.config.js
if [ ! -f "postcss.config.js" ]; then
  echo "❌ No se encontró postcss.config.js - Creando..."
  echo "export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}" > postcss.config.js
  echo "✅ postcss.config.js creado"
else
  echo "✅ postcss.config.js existe"
fi

# Verificar tailwind.config.js
if [ ! -f "tailwind.config.js" ]; then
  echo "❌ No se encontró tailwind.config.js - Creando..."
  echo "/** @type {import('tailwindcss').Config} */
export default {
  content: [
    \"./index.html\",
    \"./src/**/*.{js,ts,jsx,tsx}\",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}" > tailwind.config.js
  echo "✅ tailwind.config.js creado"
else
  echo "✅ tailwind.config.js existe"
fi

# Verificar index.css
if [ -f "src/index.css" ]; then
  if ! grep -q "@tailwind base" "src/index.css"; then
    echo "❌ No se encontraron directivas de Tailwind en index.css - Corrigiendo..."
    echo "@tailwind base;
@tailwind components;
@tailwind utilities;

$(cat src/index.css)" > src/index.css.tmp
    mv src/index.css.tmp src/index.css
    echo "✅ Directivas de Tailwind añadidas a index.css"
  else
    echo "✅ index.css contiene directivas de Tailwind"
  fi
else
  echo "❌ No se encontró src/index.css - Creando..."
  echo "@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

body {
  margin: 0;
  min-height: 100vh;
}

/* Estilos personalizados para mensajes de chat */
.message-bubble {
  @apply max-w-[80%] rounded-lg p-3 my-1;
}

.message-mine {
  @apply bg-blue-500 text-white ml-auto rounded-bl-lg rounded-tl-lg rounded-tr-lg;
}

.message-others {
  @apply bg-gray-200 text-gray-800 mr-auto rounded-br-lg rounded-tr-lg rounded-tl-lg;
}" > src/index.css
  echo "✅ src/index.css creado con directivas de Tailwind"
fi

# Reinstalar dependencias
echo "🔄 Reinstalando dependencias de Tailwind..."
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss postcss autoprefixer

# Reinicializar Tailwind
echo "🔄 Reinicializando Tailwind..."
npx tailwindcss init -p

echo "✅ ¡Diagnóstico y corrección completados!"
echo "🚀 Por favor, reinicia el servidor de desarrollo con 'npm run dev'"