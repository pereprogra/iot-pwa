import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // Solo necesitamos la URL de la base de datos para lectura pública
  // (Si las reglas de lectura de la base de datos están abiertas, esto funcionará. 
  // De lo contrario, se necesitará la configuración completa o usar Admin SDK en el servidor).
  databaseURL: "https://proyectoiot-b04fa-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const database = getDatabase(app);
