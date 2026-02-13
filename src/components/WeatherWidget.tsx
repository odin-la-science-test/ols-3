import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 22,
    condition: 'sunny',
    humidity: 65,
    wind: 12
  });

  useEffect(() => {
    // Simulation de données météo (à remplacer par une vraie API si besoin)
    const conditions = ['sunny', 'cloudy', 'rainy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    setWeather({
      temp: Math.floor(Math.random() * 15) + 15,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 40,
      wind: Math.floor(Math.random() * 20) + 5
    });
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun size={32} />;
      case 'rainy': return <CloudRain size={32} />;
      default: return <Cloud size={32} />;
    }
  };

  const getWeatherColor = () => {
    switch (weather.condition) {
      case 'sunny': return '#f59e0b';
      case 'rainy': return '#3b82f6';
      default: return '#64748b';
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      borderRadius: '1rem',
      background: `linear-gradient(135deg, ${getWeatherColor()}15, transparent)`,
      borderLeft: `3px solid ${getWeatherColor()}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: getWeatherColor() }}>
          {getWeatherIcon()}
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
            {weather.temp}°C
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Conditions de laboratoire
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Droplets size={16} style={{ color: '#3b82f6' }} />
          <span>{weather.humidity}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wind size={16} style={{ color: '#10b981' }} />
          <span>{weather.wind} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
