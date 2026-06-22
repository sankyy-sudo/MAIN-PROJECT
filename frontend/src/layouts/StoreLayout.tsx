import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        background:
          "linear-gradient(135deg, #f7fbfa 0%, #eef8f6 48%, #fff7ed 100%)"
      }}
    >
      <StoreHeader />
      <Box component="main" sx={{ py: 4 }}>
        <Outlet />
      </Box>
      <Box
        component="footer"
        sx={{
          mt: 4,
          py: 5,
          color: "common.white",
          background:
            "linear-gradient(135deg, #0f3f4f 0%, #155e75 55%, #f97316 150%)"
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack spacing={1} sx={{ maxWidth: 420 }}>
              <Typography variant="h5">COTECAE</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.74)" }}>
                Premium coffee commerce, professional ordering, and academy updates in one place.
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ maxWidth: 460, width: "100%" }}>
              <Typography variant="h6">Newsletter</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.92)"
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
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
          </Stack>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.18)", my: 3 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.70)" }}>
            {"\u00A9"} {new Date().getFullYear()} COTECAE. All rights reserved.
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
          color="success"
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 1200,
            boxShadow: "0 18px 40px rgba(21, 128, 61, 0.28)"
          }}
        >
          WhatsApp
        </Button>
      )}
    </Box>
  );
};

export default StoreLayout;
