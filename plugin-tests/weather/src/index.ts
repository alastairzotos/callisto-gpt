export const getWeather = async ({ location, date }: Record<string, string>) => {
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`;

    const res = await fetch(url);
    const data = await res.json();

    return `${data.current.temp_c}°C, ${data.current.condition.text}`;
  } catch (e) {
    console.error(e);
    return 'Problem getting weather';
  }
}
