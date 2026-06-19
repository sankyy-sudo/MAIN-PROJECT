import { Alert, Button, Container, Link as MuiLink, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface ForgotForm {
  email: string;
}

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<ForgotForm>();

  const submit = async (values: ForgotForm) => {
    setError("");
    try {
      await api.post("/auth/forgot-password", values);
      setSent(true);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to send reset email");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(submit)}>
          <Typography variant="h5">Reset password</Typography>
          {sent && <Alert severity="success">Check your email for a reset link.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" type="email" {...register("email", { required: true })} />
          <Button type="submit" variant="contained">Send reset link</Button>
          <MuiLink component={Link} to="/login">Back to login</MuiLink>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
