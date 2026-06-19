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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import api from "../../services/api";
import { loginSuccess } from "../../store/slices/authSlice";
import { fetchCart } from "../../store/slices/cartSlice";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CustomerRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>();

  const submit = async (values: RegisterForm) => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/customer/register", {
        name: values.name,
        email: values.email,
        password: values.password
      });
      dispatch(
        loginSuccess({
          user: response.data.data.user,
          token: response.data.data.accessToken
        })
      );
      await dispatch(fetchCart());
      navigate("/store/products");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Registration failed");
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
              color="primary"
              align="center"
              sx={{ fontWeight: 700 }}
            >
              COTECAE
            </Typography>
            <Typography variant="h5" align="center">
              Create your account
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              {...register("name", { required: "Name is required", minLength: 2 })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              {...register("email", { required: "Email is required" })}
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
            <TextField
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match"
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Create Account"}
            </Button>
            <MuiLink component={Link} to="/login" align="center">
              Already have an account? Sign in
            </MuiLink>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomerRegister;
