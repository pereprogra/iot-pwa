'use client';

import { useEffect, useState } from 'react';
import { useSensorData } from '@/hooks/useSensorData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cloud, Thermometer, Droplets, MapPin, Radio, Satellite, Activity } from 'lucide-react';

export default function Dashboard() {
  const { data: sensorData, loading: sensorLoading } = useSensorData();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        const json = await res.json();
        setWeatherData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setWeatherLoading(false);
      }
    }
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  const chartData = sensorData.map((d) => ({
    time: d.Hora,
    Temp_Local: d.Temperatura,
    Hum_Local: d.Humedad,
    Temp_Satelite: weatherData?.temperatura || null,
    Hum_Satelite: weatherData?.humedad || null,
  }));

  const currentSensor = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Encabezado Principal */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-slate-800/40 border border-slate-700/50 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <Activity className="text-indigo-400 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Estación IoT PWA</h1>
              <p className="text-slate-400 text-sm mt-1">Comparación en tiempo real: Hardware vs Satélite</p>
            </div>
          </div>
          
          {weatherData && (
            <div className="flex items-center gap-3 bg-slate-900/60 px-5 py-3 rounded-2xl border border-slate-700">
              <MapPin className="text-rose-400 w-5 h-5" />
              <div>
                <p className="text-white font-medium">{weatherData.ciudad}</p>
                <p className="text-xs text-slate-400 capitalize">{weatherData.descripcion}</p>
              </div>
            </div>
          )}
        </header>

        {/* Tarjetas de Datos Actuales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tarjeta Sensor Físico */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-md transition-all hover:border-blue-500/30 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Radio className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sensor Local (ESP32)</h2>
                  <p className="text-xs text-slate-400">Datos del nodo físico en sitio</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                En línea
              </span>
            </div>

            {sensorLoading ? (
              <div className="animate-pulse flex gap-8">
                <div className="h-16 w-24 bg-slate-700/50 rounded-xl"></div>
                <div className="h-16 w-24 bg-slate-700/50 rounded-xl"></div>
              </div>
            ) : currentSensor ? (
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    <span className="text-sm">Temperatura</span>
                  </div>
                  <p className="text-4xl font-bold text-white tracking-tight">{currentSensor.Temperatura}<span className="text-xl text-slate-500 ml-1">°C</span></p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Humedad</span>
                  </div>
                  <p className="text-4xl font-bold text-white tracking-tight">{currentSensor.Humedad}<span className="text-xl text-slate-500 ml-1">%</span></p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">Esperando datos del sensor...</p>
            )}
          </div>

          {/* Tarjeta Satélite API */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-md transition-all hover:border-amber-500/30 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                  <Satellite className="text-amber-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">API Meteorológica</h2>
                  <p className="text-xs text-slate-400">OpenWeatherMap (Satélite)</p>
                </div>
              </div>
              <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Sincronizado
              </span>
            </div>

            {weatherLoading ? (
              <div className="animate-pulse flex gap-8">
                <div className="h-16 w-24 bg-slate-700/50 rounded-xl"></div>
                <div className="h-16 w-24 bg-slate-700/50 rounded-xl"></div>
              </div>
            ) : weatherData ? (
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    <span className="text-sm">Temperatura</span>
                  </div>
                  <p className="text-4xl font-bold text-white tracking-tight">{Math.round(weatherData.temperatura)}<span className="text-xl text-slate-500 ml-1">°C</span></p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Cloud className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Humedad</span>
                  </div>
                  <p className="text-4xl font-bold text-white tracking-tight">{weatherData.humedad}<span className="text-xl text-slate-500 ml-1">%</span></p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">Error obteniendo clima</p>
            )}
          </div>
        </div>

        {/* Sección de Gráficos Evolutivos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Gráfico Temperatura */}
          <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Thermometer className="text-rose-400 w-5 h-5" />
                Histórico de Temperatura
              </h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTempLocal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                  <Area type="monotone" name="Sensor Local (°C)" dataKey="Temp_Local" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTempLocal)" />
                  <Area type="stepAfter" name="Satélite (°C)" dataKey="Temp_Satelite" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico Humedad */}
          <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Droplets className="text-blue-400 w-5 h-5" />
                Histórico de Humedad
              </h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHumLocal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                  <Area type="monotone" name="Sensor Local (%)" dataKey="Hum_Local" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorHumLocal)" />
                  <Area type="stepAfter" name="Satélite (%)" dataKey="Hum_Satelite" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
