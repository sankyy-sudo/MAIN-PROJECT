import {
  createSlice
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  businessAccountId?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface LoginPayload {
  user: AuthUser;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(
    "token"
  )
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<LoginPayload>
    ) {
      state.user =
        action.payload.user;

      state.token =
        action.payload.token;

      localStorage.setItem(
        "token",
        action.payload.token
      );
    },

    logout(state) {
      state.user = null;

      state.token = null;

      localStorage.removeItem(
        "token"
      );
    }
  }
});

export const {
  loginSuccess,
  logout
} = authSlice.actions;

export default authSlice.reducer;
