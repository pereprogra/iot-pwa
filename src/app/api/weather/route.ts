import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const lat = process.env.LAT || '-16.4897';
    const lon = process.env.LON || '-68.1193';
    const apiKey = process.env.OWM_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    // Call OpenWeatherMap One Call API (or Current Weather Data if One Call isn't free)
    // We'll use the Current Weather Data API first
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=es`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Error fetching weather' }, { status: response.status });
    }

    // Format the response to be easily consumable by our charts
    const formattedData = {
      temperatura: data.main.temp,
      humedad: data.main.humidity,
      ciudad: data.name,
      descripcion: data.weather[0].description,
      fecha: new Date().toLocaleDateString('es-BO'),
      hora: new Date().toLocaleTimeString('es-BO'),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error in /api/weather:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
