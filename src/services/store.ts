import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {baseApi} from './api';
import {userSlice} from './slices/userSlice';
import {authSlice} from './slices/authSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  user: userSlice.reducer,
  auth: authSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
