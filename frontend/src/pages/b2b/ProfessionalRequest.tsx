import {
  Alert,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { loginSuccess } from "../../store/slices/authSlice";

const initialForm = {
  companyName: "",
  gstNumber: "",
  businessAddress: "",
  contactPerson: "",
  email: "",
  phone: "",
  pricingTier: "SILVER"
};

const ProfessionalRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const change =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };

  const submit = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/b2b/accounts/request-access", form);
      dispatch(
        loginSuccess({
          user: response.data.data.user,
          token: response.data.data.accessToken
        })
      );
      setSuccess("Professional access enabled. Your B2B pricing is active.");
      setTimeout(() => navigate("/professional/dashboard"), 800);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to request access");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4">Professional / B2B access</Typography>
          <Typography color="text.secondary">
            Register your business account to unlock wholesale pricing, bulk ordering,
            invoices, and priority support.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField label="Company name" value={form.companyName} onChange={change("companyName")} required />
          <TextField label="GST number" value={form.gstNumber} onChange={change("gstNumber")} required />
          <TextField label="Business address" multiline minRows={3} value={form.businessAddress} onChange={change("businessAddress")} required />
          <TextField label="Contact person" value={form.contactPerson} onChange={change("contactPerson")} required />
          <TextField label="Business email" type="email" value={form.email} onChange={change("email")} required />
          <TextField label="Phone" value={form.phone} onChange={change("phone")} required />
          <TextField select label="Preferred pricing tier" value={form.pricingTier} onChange={change("pricingTier")}>
            {["SILVER", "GOLD", "PLATINUM"].map((tier) => (
              <MenuItem key={tier} value={tier}>
                {tier}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={submit}>
            Enable professional access
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProfessionalRequest;
