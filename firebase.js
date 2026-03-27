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

async function cargarMenuNube() {
  console.log("Descargando menú desde la nube...");
  
  try {
    const consulta = await getDocs(collection(db, "Productos"));
    const menuNube = [];
    
    consulta.forEach((documento) => {
      let platillo = documento.data();
      
      // Como en Firebase aún no le ponemos calificación ni opciones a la Torre de Hot Cakes, 
      // le ponemos estos valores por defecto para que la tarjeta no marque error al dibujarse.
      platillo.calificacion = platillo.calificacion || 5.0;
      platillo.resenas = platillo.resenas || 1;
      platillo.opciones = platillo.opciones || [];
      
      menuNube.push(platillo);
    });
    
    // 1. Inyectamos los datos de la nube a tu variable global del catálogo
    window.catalogo = menuNube;
    
    // 2. Le damos la orden a la pantalla de dibujar las tarjetas
    window.renderizarMenu();
    
    console.log("¡Menú dibujado con éxito!");
  } catch (error) {
    console.error("Hubo un error al descargar el menú:", error);
  }
}

// Ejecutamos la descarga
cargarMenuNube();