import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import './WeatherDisplay.css';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  error?: string;
  message?: string;
}

const client = generateClient<Schema>();

const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('San Francisco');

  const fetchWeather = async (cityName: string = city) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await client.queries.getWeather({
        city: cityName
      });
      
      if (result.data) {
        const weatherData = JSON.parse(result.data as string);
        
        // Check if the response contains an error
        if (weatherData.error) {
          throw new Error(weatherData.error);
        }
        
        setWeather(weatherData as WeatherData);
      } else if (result.errors) {
        throw new Error(result.errors[0].message);
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      
      // Show mock data to prevent complete failure
      setWeather({
        city: cityName,
        country: 'N/A',
        temperature: 20,
        description: 'Unable to load weather',
        icon: '01d',
        humidity: 50,
        windSpeed: 0,
        feelsLike: 20,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleCitySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCity = formData.get('city') as string;
    if (newCity.trim()) {
      setCity(newCity.trim());
      fetchWeather(newCity.trim());
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <p>Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-container">
        <div className="weather-error">
          <p>{error}</p>
          <button onClick={() => fetchWeather()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-container">
        <p>No weather data available</p>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h3>Current Weather</h3>
        {error && (
          <div className="weather-error-banner">
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={handleCitySubmit} className="city-form">
          <input
            type="text"
            name="city"
            placeholder="Enter city name"
            defaultValue={city}
            className="city-input"
          />
          <button type="submit" className="city-submit">
            Get Weather
          </button>
        </form>
      </div>
      
      <div className="weather-content">
        <div className="weather-main">
          <div className="weather-icon">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
            />
          </div>
          <div className="weather-temp">
            <span className="temp-value">{weather.temperature}°C</span>
            <span className="temp-description">{weather.description}</span>
          </div>
        </div>
        
        <div className="weather-location">
          <span>{weather.city}, {weather.country}</span>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels like:</span>
            <span className="detail-value">{weather.feelsLike}°C</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity:</span>
            <span className="detail-value">{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind:</span>
            <span className="detail-value">{weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay; 