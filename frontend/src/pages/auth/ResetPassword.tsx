import { Alert, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, watch } = useForm<ResetForm>();

  const submit = async (values: ResetForm) => {
    setError("");
    try {
      await api.post(`/auth/reset-password/${token}`, { password: values.password });
      setMessage("Password updated");
      setTimeout(() => navigate("/login"), 1500);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to reset password");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(submit)}>
          <Typography variant="h5">Choose a new password</Typography>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Password"
            type="password"
            {...register("password", { required: true, minLength: 6 })}
          />
          <TextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              validate: (value) => value === watch("password")
            })}
          />
          <Button type="submit" variant="contained">Update Password</Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
