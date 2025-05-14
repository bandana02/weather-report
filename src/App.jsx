import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('Patna');
  const [query, setQuery] = useState('Patna'); // used for triggering search
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              key: 'bc59ac78c25e48df96c52453250805',
              q: query,
              days: 10,
              aqi: 'no',
              alerts: 'no',
            },
          }
        );

        const data = response.data;

        if (data.error) {
          setError(data.error.message);
          setForecast([]);
        } else {
          setForecast(data.forecast.forecastday);
          setError('');
        }
      } catch (err) {
        setError('Failed to fetch data');
        setForecast([]);
      }
    };

    if (query) {
      fetchWeather();
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(city);
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
