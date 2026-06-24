import { createSlice } from '@reduxjs/toolkit';

let savedUser = null;
let savedToken = null;
let savedRefreshToken = null;

try {
  const userStr = localStorage.getItem('user');
  if (userStr && userStr !== 'undefined') {
    savedUser = JSON.parse(userStr);
  }
  
  const tokenStr = localStorage.getItem('token');
  if (tokenStr && tokenStr !== 'undefined') {
    savedToken = tokenStr;
  }

  const refreshTokenStr = localStorage.getItem('refreshToken');
  if (refreshTokenStr && refreshTokenStr !== 'undefined') {
    savedRefreshToken = refreshTokenStr;
  }
} catch (error) {
  console.error("Failed to parse auth data from local storage", error);
}

const initialState = {
  user: savedUser,
  token: savedToken,
  refreshToken: savedRefreshToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      
      // Update state
      if (user) state.user = user;
      if (token) state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;

      // Update localStorage
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
