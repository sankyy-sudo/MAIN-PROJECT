import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { fetchCart } from "../store/slices/cartSlice";
import StoreHeader from "../components/store/StoreHeader";
import api from "../services/api";
import { getWhatsAppUrl } from "../services/integrations";

const StoreLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const whatsappUrl = getWhatsAppUrl();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <StoreHeader />
      <Box component="main" sx={{ py: 4 }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ py: 4, bgcolor: "action.hover" }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Typography variant="h6">Newsletter</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                size="small"
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button
                variant="contained"
                onClick={async () => {
                  await api.post("/marketing/newsletter/subscribe", {
                    email,
                    source: "store-footer"
                  });
                  setEmail("");
                  setMessage("Subscribed to newsletter");
                }}
                disabled={!email}
              >
                Subscribe
              </Button>
            </Stack>
            {message && <Alert severity="success">{message}</Alert>}
          </Stack>
          <Typography color="text.secondary">
            © {new Date().getFullYear()} COTECAE. All rights reserved.
          </Typography>
        </Container>
      </Box>
      {whatsappUrl && (
        <Button
          component="a"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          variant="contained"
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 1200
          }}
        >
          WhatsApp
        </Button>
      )}
    </Box>
  );
};

export default StoreLayout;
