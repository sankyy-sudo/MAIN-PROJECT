import { Box, Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { fetchCart } from "../store/slices/cartSlice";
import StoreHeader from "../components/store/StoreHeader";

const StoreLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

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
          <Typography color="text.secondary">
            © {new Date().getFullYear()} COTECAE. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default StoreLayout;
