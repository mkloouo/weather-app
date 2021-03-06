import { config } from '../../config';
import {
  DEFAULT_NUMBER_OF_FORECAST_DAYS,
} from '../../constants';
import { LatitudeAndLongitude } from './weatherSlice';

export interface WeatherData {
  rh: number;
  pod: string;
  lon: number;
  pres: number;
  timezone: string;
  ob_time: string;
  country_code: string;
  clouds: number;
  ts: number;
  solar_rad: number;
  state_code: string;
  city_name: string;
  wind_spd: number;
  wind_cdir_full: string;
  wind_cdir: string;
  slp: number;
  vis: number;
  h_angle: number;
  sunset: string;
  dni: number;
  dewpt: number;
  snow: number;
  uv: number;
  precip: number;
  wind_dir: number;
  sunrise: string;
  ghi: number;
  dhi: number;
  aqi: number;
  lat: number;
  weather: {
    icon: string;
    code: number;
    description: string;
  };
  datetime: string;
  temp: number;
  station: string;
  elev_angle: number;
  app_temp: number;
}

interface WeatherDataResponse {
  data: Array<WeatherData>;
  count: number;
}

export const fetchCurrentWeather = async ({
  lat,
  lon,
}: LatitudeAndLongitude) => {
  const response = await fetch(
    `${config.apis.weather.url}/current?lat=${lat}&lon=${lon}&key=${config.apis.weather.key}`
  );

  return (await response.json()) as WeatherDataResponse;
};

export const fetchWeatherForecast = async ({
  lat,
  lon,
}: LatitudeAndLongitude) => {
  const response = await fetch(
    `${config.apis.weather.url}/forecast/daily?lat=${lat}&lon=${lon}&key=${config.apis.weather.key}&days=${DEFAULT_NUMBER_OF_FORECAST_DAYS}`
  );

  return (await response.json()) as WeatherDataResponse;
};
