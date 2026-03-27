import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAouJ5eNSTVzvcOLowXVrbloo2-ESeTQVU",
  authDomain: "cafeteria-proyecto-escolar.firebaseapp.com",
  projectId: "cafeteria-proyecto-escolar",
  storageBucket: "cafeteria-proyecto-escolar.firebasestorage.app",
  messagingSenderId: "636358773053",
  appId: "1:636358773053:web:18eebf80e879e03e2ddd54"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db;

// --- DICCIONARIO DE INYECCIÓN ---
// Esto le agrega la "magia" compleja a los datos básicos de Firebase
const detallesExtra = {
  "Chocolate caliente": { calificacion: 4.8, resenas: 124, opciones: [{ nombreFiltro: "Tipo de Leche", variaciones: [{etiqueta: "Leche Entera", extra: 0}, {etiqueta: "Leche de Almendra", extra: 15}, {etiqueta: "Leche de Avena", extra: 15}] }] },
  "Crepas": { calificacion: 4.9, resenas: 89, opciones: [{ nombreFiltro: "Topping Extra", variaciones: [{etiqueta: "Ninguno", extra: 0}, {etiqueta: "Extra Nutella", extra: 20}, {etiqueta: "Frutos Rojos", extra: 25}] }] },
  "Donas": { calificacion: 4.5, resenas: 42, opciones: [] },
  "Helado": { calificacion: 4.6, resenas: 55, opciones: [] },
  "Limonada": { calificacion: 4.7, resenas: 30, opciones: [] },
  "Malteada": { calificacion: 4.8, resenas: 110, opciones: [] },
  "Muffins": { calificacion: 4.3, resenas: 25, opciones: [] },
  "Pancake osito": { calificacion: 5.0, resenas: 200, opciones: [] },
  "Torre de hot cakes": { calificacion: 4.9, resenas: 150, opciones: [{ nombreFiltro: "Bañado en", variaciones: [{etiqueta: "Miel de Maple", extra: 0}, {etiqueta: "Lechera", extra: 15}, {etiqueta: "Cajeta", extra: 15}] }] }
};

async function cargarMenuNube() {
  console.log("Descargando menú desde la nube...");
  
  try {
    const consulta = await getDocs(collection(db, "Productos"));
    const menuNube = [];
    
    consulta.forEach((documento) => {
      let platillo = documento.data();
      
      // Buscamos si el platillo de Firebase existe en nuestro diccionario
      let extras = detallesExtra[platillo.nombre];
      
      // Si existe, le inyectamos las opciones y estrellas. Si no, le ponemos valores por defecto.
      if (extras) {
          platillo.calificacion = extras.calificacion;
          platillo.resenas = extras.resenas;
          platillo.opciones = extras.opciones;
      } else {
          platillo.calificacion = 5.0;
          platillo.resenas = 1;
          platillo.opciones = [];
      }
      
      menuNube.push(platillo);
    });
    
    // 1. Inyectamos los datos combinados a tu variable global del catálogo
    window.catalogo = menuNube;
    
    // 2. Le damos la orden a la pantalla de dibujar las tarjetas
    window.renderizarMenu();
    
    console.log("¡Menú dinámico dibujado con éxito!");
  } catch (error) {
    console.error("Hubo un error al descargar el menú:", error);
  }
}

// Ejecutamos la descarga
cargarMenuNube();