import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';

export interface SensorEntry {
  id: string;
  Temperatura: number;
  Humedad: number;
  Fecha: string;
  Hora: string;
}

export function useSensorData() {
  const [data, setData] = useState<SensorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consultamos los últimos 20 registros
    const dbRef = query(ref(database, 'temp_hum'), limitToLast(20));
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convertimos el objeto de Firebase a un Array
        const dataArray = Object.keys(val).map(key => ({
          id: key,
          ...val[key]
        }));
        setData(dataArray);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { data, loading };
}
