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

async function pruebaDeConexion() {
  console.log("Buscando platillos en Firebase...");
  
  try {
    const consulta = await getDocs(collection(db, "Productos"));
    const menuNube = [];
    
    consulta.forEach((documento) => {
      menuNube.push(documento.data());
    });
    
    console.log("¡Éxito total! Datos recibidos:", menuNube);
  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  }
}

pruebaDeConexion();