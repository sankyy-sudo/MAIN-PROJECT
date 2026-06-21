import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../../components/checkout/PaymentForm";
import api from "../../services/api";
import type { AppDispatch } from "../../store";
import {
  fetchCart,
  selectCartItems,
  selectDiscount,
  selectSubtotal
} from "../../store/slices/cartSlice";
import { formatCurrency } from "../../utils/format";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [quote, setQuote] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!items.length || order) return;
    const timeout = window.setTimeout(() => {
      api
        .post("/commerce/quote", { couponCode: couponCode || undefined })
        .then((response) => setQuote(response.data.data))
        .catch((requestError) => {
          setQuote(null);
          if (couponCode) {
            setError(requestError.response?.data?.message || "Coupon is invalid");
          }
        });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [couponCode, items.length, order]);

  const activeSubtotal = quote?.subtotal ?? subtotal;
  const activeDiscount = quote?.discountAmount ?? discount;
  const shippingAmount = quote?.shippingAmount ?? 0;
  const taxAmount = quote?.taxAmount ?? 0;
  const total = quote?.totalAmount ?? Math.max(subtotal - discount, 0);

  const createOrder = async () => {
    setError("");
    if (!items.length) {
      setError("Your cart is empty");
      return;
    }
    if (!shippingAddress.trim()) {
      setError("Shipping address is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/orders/checkout", {
        shippingAddress,
        notes,
        couponCode: couponCode || undefined,
        paymentMethod
      });
      setOrder(response.data.data);
      await dispatch(fetchCart());
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to create order");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !order) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h5">Your cart is empty</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/store/products")}>
            Continue shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Checkout
      </Typography>
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1.4fr 0.8fr" } }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <LocalShippingIcon color="primary" /> Shipping details
              </Typography>
              <TextField
                label="Shipping address"
                multiline
                minRows={4}
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                disabled={Boolean(order)}
                required
              />
              <TextField
                label="Order notes"
                multiline
                minRows={2}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={Boolean(order)}
              />
              <TextField
                label="Coupon code"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                disabled={Boolean(order)}
              />
              <TextField
                select
                label="Payment method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                disabled={Boolean(order)}
              >
                <MenuItem value="STRIPE">Card / Stripe</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank transfer for B2B</MenuItem>
                <MenuItem value="PAYPAL">PayPal placeholder</MenuItem>
              </TextField>
              {error && <Alert severity="error">{error}</Alert>}
              {!order && (
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={createOrder}
                >
                  {loading ? <CircularProgress size={22} /> : "Create order"}
                </Button>
              )}
            </Stack>
          </Paper>

          {order && (
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <PaymentIcon color="primary" /> Payment
                </Typography>
                <Alert severity="success">
                  Order {order.orderNumber} created. Complete payment to finish checkout.
                </Alert>
                {order.paymentMethod === "STRIPE" && (
                  <PaymentForm
                    orderId={order.id}
                    onSuccess={() => navigate(`/checkout/success?orderId=${order.id}`)}
                  />
                )}
                {order.paymentMethod === "BANK_TRANSFER" && (
                  <Button
                    variant="contained"
                    onClick={() => api.post("/payments/bank-transfer", { orderId: order.id })}
                  >
                    Generate Bank Transfer Instructions
                  </Button>
                )}
                {order.paymentMethod === "PAYPAL" && (
                  <Button
                    variant="contained"
                    onClick={() => api.post("/payments/paypal/order", { orderId: order.id })}
                  >
                    Create PayPal Placeholder
                  </Button>
                )}
                <Button variant="outlined" onClick={() => navigate(`/checkout/success?orderId=${order.id}`)}>
                  Skip payment for demo
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Order summary</Typography>
              <Divider />
              {(order?.items || items).map((item: any) => (
                <Stack key={item.id} direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography>
                    {item.product?.name || item.productName} × {item.quantity}
                  </Typography>
                  <Typography>
                    {formatCurrency(item.lineTotal || Number(item.unitPrice) * item.quantity)}
                  </Typography>
                </Stack>
              ))}
              <Divider />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography>Subtotal</Typography>
                <Typography>{formatCurrency(order?.subtotal || activeSubtotal)}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between", color: "success.main" }}>
                <Typography>Discount</Typography>
                <Typography>-{formatCurrency(order?.discountAmount || activeDiscount)}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography>{formatCurrency(order?.shippingAmount ?? shippingAmount)}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography>VAT / Tax</Typography>
                <Typography>{formatCurrency(order?.taxAmount ?? taxAmount)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(order?.totalAmount || total)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
