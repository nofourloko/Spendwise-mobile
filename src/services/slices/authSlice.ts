import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {AuthResponse, AuthStatus, AuthTokens} from '../../types/auth';
import type {User} from '../../types/user';

type AuthSliceState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  status: AuthStatus;
};

const initialState: AuthSliceState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  // Start in `bootstrapping` so the UI can show a splash while we read any
  // persisted token from storage before deciding auth vs. app navigation.
  status: 'bootstrapping',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Full sign-in: tokens + profile from a login / register response. */
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.status = 'authenticated';
    },
    /** Restore a session from persisted tokens on cold start (profile lazily fetched). */
    restoreSession: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.status = 'authenticated';
    },
    /** Rotate just the token pair after a silent refresh. */
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    /** Sign out / failed bootstrap: drop everything and mark unauthenticated. */
    clearCredentials: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const {setCredentials, restoreSession, setTokens, clearCredentials} =
  authSlice.actions;
export default authSlice.reducer;
