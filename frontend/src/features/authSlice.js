import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { register: response.data, authType: 'register' };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', userData);
      return { user: response.data, authType: 'login' };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      console.log("setUser action payload:", action.payload); // Log the action payload
      return { ...state, user: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload));

      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload));

      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, setUser } = authSlice.actions;
export default authSlice.reducer;
