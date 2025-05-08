import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Patna');
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=bc59ac78c25e48df96c52453250805&q=${city}&days=10&aqi=no&alerts=no`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        setForecast([]);
        return;
      }

      setForecast(data.forecast.forecastday);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="container">
      <h1>10-Day Weather Forecast</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="forecast-list">
        {forecast.map((day) => (
          <div className="forecast-day" key={day.date}>
            <div className="left">
              <div>
                <strong>{new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}</strong>
              </div>
              <img src={day.day.condition.icon} alt="weather icon" />
              <div className="temps">
                {day.day.maxtemp_c}° / {day.day.mintemp_c}°
              </div>
            </div>

            <div className="info">
              <div>{day.day.condition.text}</div>
              <div>🌙 Night: {day.astro.moon_phase}</div>
            </div>

            <div className="right">
              💧 {day.day.daily_chance_of_rain || 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
