import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { formatCurrency } from "../../utils/format";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    api
      .get(`/orders/${orderId}`)
      .then((response) => setOrder(response.data.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load order");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 5, textAlign: "center" }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 86 }} />
          <Typography variant="h4">Thank you for your order</Typography>
          <Typography color="text.secondary">
            We have received your order and sent confirmation details to your email when email is configured.
          </Typography>
          {loading && <CircularProgress />}
          {error && <Alert severity="warning">{error}</Alert>}
          {order && (
            <Alert severity="success" sx={{ width: "100%" }}>
              Order {order.orderNumber} · Total {formatCurrency(order.totalAmount)}
            </Alert>
          )}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" onClick={() => navigate("/account/orders")}>
              View my orders
            </Button>
            <Button variant="outlined" onClick={() => navigate("/store/products")}>
              Continue shopping
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage;
