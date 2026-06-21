import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const CustomerAccount = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "240px 1fr" } }}>
        <Paper sx={{ p: 2, alignSelf: "start" }}>
          <Stack spacing={1}>
            <Typography variant="h6">My account</Typography>
            <Button onClick={() => navigate("/account/orders")}>Orders</Button>
            <Button onClick={() => navigate("/account/profile")}>Profile</Button>
            <Button onClick={() => navigate("/store/products")}>Shop</Button>
          </Stack>
        </Paper>
        <Outlet />
      </Box>
    </Container>
  );
};

export default CustomerAccount;
