import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig/instance';

export const loginAsync = createAsyncThunk('auth/loginAsync', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Accounts/Login', { email, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  user: false,
  token: localStorage.getItem('token') || null,
  error: null,
  status: 'idle',
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = true;
        state.token = action.payload.data.token;
        localStorage.setItem('token', action.payload.data.token);
        state.error = null;

      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.message : 'Login failed';
      });
  },
});



export const { logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectError = (state) => state.auth.error;
export default authSlice.reducer;