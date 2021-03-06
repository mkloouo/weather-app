import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  fetchCurrentWeather,
  fetchWeatherForecast,
  WeatherData as WeatherAPIWeatherData,
} from './weatherAPI';

export interface CurrentWeatherData {
  description: string;
  temp: string;
  icon: string;
  date: string;
}

interface WeatherData {
  current?: CurrentWeatherData;
  forecast?: CurrentWeatherData[];
}

export interface LatitudeAndLongitude {
  lat: number;
  lon: number;
}

export interface WeatherState {
  latAndLon?: LatitudeAndLongitude;
  value?: WeatherData;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: WeatherState = {
  status: 'idle',
};

export const getCurrentWeatherAsync = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async ({ lat, lon }: LatitudeAndLongitude) => {
    const response = await fetchCurrentWeather({ lat, lon });
    return response;
  }
);

export const getWeatherForecastAsync = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async ({ lat, lon }: LatitudeAndLongitude) => {
    const response = await fetchWeatherForecast({ lat, lon });
    return response;
  }
);

const processWeatherDataResponse = (
  item: WeatherAPIWeatherData
): CurrentWeatherData => ({
  description: item.weather.description,
  temp: item.temp > 0 ? `+${item.temp}` : String(item.temp),
  icon: item.weather.icon,
  date: item.datetime,
});

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLatAndLon: (
      state,
      action: PayloadAction<{ lat: number; lon: number }>
    ) => {
      state.latAndLon = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentWeatherAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentWeatherAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = {
          ...state.value,
          current: action.payload.data.map(processWeatherDataResponse)[0],
        };
      })
      .addCase(getWeatherForecastAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getWeatherForecastAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = {
          ...state.value,
          forecast: action.payload.data.map(processWeatherDataResponse),
        };
      });
  },
});

export const { setLatAndLon } = weatherSlice.actions;

export const selectLatAndLon = (state: RootState) => state.weather.latAndLon;
export const selectWeather = (state: RootState) => state.weather.value;

// TODO: possibly use hand-written async thunk
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default weatherSlice.reducer;
