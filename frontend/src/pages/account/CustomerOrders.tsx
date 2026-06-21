import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import type { IOrder } from "../../types/store";
import { formatCurrency } from "../../utils/format";

const CustomerOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/my")
      .then((response) => setOrders(response.data.data.orders || []))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load orders");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">My orders</Typography>
      {orders.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>No orders yet.</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/store/products")}>
            Start shopping
          </Button>
        </Paper>
      )}
      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 2 }}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr auto auto" }, alignItems: "center" }}>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{order.orderNumber}</Typography>
              <Typography color="text.secondary">
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip label={order.status} color="primary" variant="outlined" />
              <Chip label={order.paymentStatus} color="success" variant="outlined" />
            </Stack>
            <Typography sx={{ fontWeight: 700 }}>
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default CustomerOrders;
