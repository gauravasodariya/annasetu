import React, { createContext, useReducer } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

const AuthContext = createContext();
export const AlertContext = createContext();

const SET_LOADING = "SET_LOADING";
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const REGISTER_FAIL = "REGISTER_FAIL";
const USER_LOADED = "USER_LOADED";
const AUTH_ERROR = "AUTH_ERROR";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const GOOGLE_LOGIN_SUCCESS = "GOOGLE_LOGIN_SUCCESS";
const LOGIN_FAIL = "LOGIN_FAIL";
const LOGOUT = "LOGOUT";
const CLEAR_ERRORS = "CLEAR_ERRORS";
const UPDATE_SUCCESS = "UPDATE_SUCCESS";
const FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST";
const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
const FORGOT_PASSWORD_FAIL = "FORGOT_PASSWORD_FAIL";
const RESET_PASSWORD_REQUEST = "RESET_PASSWORD_REQUEST";
const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";
const RESET_PASSWORD_FAIL = "RESET_PASSWORD_FAIL";

const authReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: true };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case GOOGLE_LOGIN_SUCCESS:
      setAuthToken(action.payload.token);
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case UPDATE_SUCCESS:
      return { ...state, user: action.payload, loading: false, error: null };
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true };
    case FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false, passwordResetSent: true };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, passwordReset: true };
    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      setAuthToken(null);
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

const alertReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALERT":
      return { ...state, alerts: [...state.alerts, action.payload] };
    case "REMOVE_ALERT":
      return {
        ...state,
        alerts: state.alerts.filter((a) => a.id !== action.payload),
      };
    default:
      return state;
  }
};

export const AuthProvider = (props) => {
  const initialAuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
    passwordResetSent: false,
    passwordReset: false,
  };
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);

  const initialAlertState = { alerts: [] };
  const [alertState, alertDispatch] = useReducer(
    alertReducer,
    initialAlertState
  );

  const loadUser = async () => {
    try {
      const res = await axios.get("/api/auth");
      authDispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      const errorMsg = err.response?.data?.msg;
      if (errorMsg && errorMsg.includes("No token")) {
        authDispatch({ type: AUTH_ERROR, payload: null });
      } else {
        authDispatch({ type: AUTH_ERROR, payload: errorMsg });
      }
    }
  };

  const register = async (formData) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/users/register", formData, config);
      authDispatch({ type: REGISTER_SUCCESS, payload: res.data });
      // Set auth token header before loading user
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      // Small delay to ensure token is set
      setTimeout(() => loadUser(), 100);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";
      authDispatch({ type: REGISTER_FAIL, payload: errorMessage });
    }
  };

  const login = async (formData) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/auth", formData, config);
      authDispatch({ type: LOGIN_SUCCESS, payload: res.data });
      // Set auth token header before loading user
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      // Small delay to ensure token is set
      setTimeout(() => loadUser(), 100);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Login failed. Please try again.";
      authDispatch({ type: LOGIN_FAIL, payload: errorMessage });
    }
  };

  const googleLogin = async (token) => {
    try {
      const res = await axios.post("/api/auth/google", { token });
      authDispatch({ type: GOOGLE_LOGIN_SUCCESS, payload: res.data });
      // Set auth token header before loading user
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      // Small delay to ensure token is set
      setTimeout(() => loadUser(), 100);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Google login failed. Please try again.";
      authDispatch({ type: LOGIN_FAIL, payload: errorMessage });
    }
  };

  const updateProfile = async (formData) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.put("/api/users/profile", formData, config);
      authDispatch({ type: UPDATE_SUCCESS, payload: res.data });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const logout = () => {
    authDispatch({ type: LOGOUT });
  };

  const clearErrors = () => authDispatch({ type: CLEAR_ERRORS });

  const forgotPassword = async (email) => {
    authDispatch({ type: FORGOT_PASSWORD_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post(
        "/api/auth/forgot-password",
        { email },
        config
      );
      authDispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: res.data });
      return true;
    } catch (err) {
      authDispatch({
        type: FORGOT_PASSWORD_FAIL,
        payload: err.response?.data?.msg || "Failed to send reset email",
      });
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    authDispatch({ type: RESET_PASSWORD_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password },
        config
      );
      authDispatch({ type: RESET_PASSWORD_SUCCESS, payload: res.data });
      return true;
    } catch (err) {
      authDispatch({
        type: RESET_PASSWORD_FAIL,
        payload: err.response?.data?.msg || "Failed to reset password",
      });
      return false;
    }
  };

  const verifyResetToken = async (token) => {
    try {
      await axios.get(`/api/auth/reset-password/${token}`);
      return true;
    } catch {
      return false;
    }
  };

  const setAlert = (msg, type, timeout = 5000) => {
    const id = Math.random().toString(36).substring(7);
    alertDispatch({ type: "SET_ALERT", payload: { msg, type, id } });
    setTimeout(
      () => alertDispatch({ type: "REMOVE_ALERT", payload: id }),
      timeout
    );
  };
  const removeAlert = (id) =>
    alertDispatch({ type: "REMOVE_ALERT", payload: id });

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        loading: authState.loading,
        user: authState.user,
        error: authState.error,
        passwordResetSent: authState.passwordResetSent,
        passwordReset: authState.passwordReset,
        register,
        loadUser,
        login,
        googleLogin,
        logout,
        clearErrors,
        updateProfile,
        forgotPassword,
        resetPassword,
        verifyResetToken,
      }}
    >
      <AlertContext.Provider
        value={{ alerts: alertState.alerts, setAlert, removeAlert }}
      >
        {props.children}
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

export default AuthContext;
