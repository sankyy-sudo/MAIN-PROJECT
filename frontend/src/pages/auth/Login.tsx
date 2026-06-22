import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import api from "../../services/api";
import { loginSuccess } from "../../store/slices/authSlice";
import { fetchCart, mergeCart } from "../../store/slices/cartSlice";

interface LoginForm {
  email: string;
  password: string;
}

const adminRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_MANAGER",
  "INVENTORY_MANAGER",
  "SUPPORT"
];

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  const submit = async (values: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", values);
      const user = response.data.data.user;
      const token = response.data.data.accessToken;
      dispatch(loginSuccess({ user, token }));
      await dispatch(mergeCart());
      await dispatch(fetchCart());
      const redirect = searchParams.get("redirect");
      navigate(
        redirect ||
          (adminRoles.includes(user.role) ? "/dashboard" : "/store/products")
      );
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const demoAdminLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/demo-admin");
      const user = response.data.data.user;
      const token = response.data.data.accessToken;
      dispatch(loginSuccess({ user, token }));
      await dispatch(mergeCart());
      await dispatch(fetchCart());
      navigate("/dashboard");
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message || "Demo admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Paper sx={{ p: 4, width: "100%" }}>
          <Stack spacing={2} component="form" onSubmit={handleSubmit(submit)}>
            <Typography
              variant="h4"
              align="center"
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              COTECAE
            </Typography>
            <Typography variant="h5" align="center">
              Sign in to your account
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email"
                }
              })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Login"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              disabled={loading}
              onClick={demoAdminLogin}
            >
              Login as Demo Admin
            </Button>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <MuiLink component={Link} to="/forgot-password">
                Forgot password?
              </MuiLink>
              <MuiLink component={Link} to="/register">
                Create account
              </MuiLink>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
