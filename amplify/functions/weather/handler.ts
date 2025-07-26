declare const process: {
  env: {
    OPENWEATHER_API_KEY?: string;
  };
};

export const handler = async (event: any) => {
  try {
    // Extract city from GraphQL arguments
    const city = event.arguments?.city || 'San Francisco';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your-api-key-here') {
      return JSON.stringify({
        error: 'OpenWeather API key not configured. Please set OPENWEATHER_API_KEY environment variable.'
      });
    }

    // Fetch weather data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const weatherData = await response.json();

    // Format the response
    const formattedWeather = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      feelsLike: Math.round(weatherData.main.feels_like),
    };

    return JSON.stringify(formattedWeather);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return JSON.stringify({
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 