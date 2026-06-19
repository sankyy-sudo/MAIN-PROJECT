import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

interface Product {
  id: string;
  _id: string;
  name: string;
  sku: string;
  retailPrice: number;
  stockQuantity: number;
}

interface Order {
  id: string;
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: Array<{ id: string; productName: string; quantity: number; lineTotal: number }>;
  invoice?: { invoiceNumber: string };
}

const statuses = [
  "PENDING",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [shippingAddress, setShippingAddress] = useState("");
  const [taxAmount, setTaxAmount] = useState("0");
  const [shippingAmount, setShippingAmount] = useState("0");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [orderResponse, productResponse] = await Promise.all([
      api.get("/orders"),
      api.get("/products", { params: { limit: 100, isActive: true } })
    ]);
    setOrders(orderResponse.data.data.orders);
    setProducts(productResponse.data.data.products);
  }, []);

  useEffect(() => {
    load().catch(() => setError("Unable to load orders"));
  }, [load]);

  const createOrder = async () => {
    setError("");
    try {
      await api.post("/orders", {
        items: [{ productId, quantity: Number(quantity) }],
        shippingAddress,
        taxAmount: Number(taxAmount),
        shippingAmount: Number(shippingAmount)
      });
      setProductId("");
      setQuantity("1");
      setShippingAddress("");
      await load();
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to create order");
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    await load();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Orders</Typography>
        <Typography color="text.secondary">
          Create orders, manage fulfillment, invoices, refunds, and tracking.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Create Order</Typography>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" }
              }}
            >
              <TextField
                select
                label="Product"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
              >
                {products.map((product) => (
                  <MenuItem
                    key={product.id || product._id}
                    value={product.id || product._id}
                    disabled={product.stockQuantity < 1}
                  >
                    {product.name} ({product.sku}) — Stock {product.stockQuantity}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
              <TextField
                label="Tax"
                type="number"
                value={taxAmount}
                onChange={(event) => setTaxAmount(event.target.value)}
              />
              <TextField
                label="Shipping"
                type="number"
                value={shippingAmount}
                onChange={(event) => setShippingAmount(event.target.value)}
              />
            </Box>
            <TextField
              label="Shipping Address"
              multiline
              minRows={2}
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
            />
            <Button
              variant="contained"
              onClick={createOrder}
              disabled={!productId || !shippingAddress || Number(quantity) < 1}
            >
              Create Order
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {orders.map((order) => (
        <Card key={order.id || order._id}>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                sx={{ justifyContent: "space-between", gap: 2 }}
              >
                <Box>
                  <Typography variant="h6">{order.orderNumber}</Typography>
                  <Typography color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()} ·{" "}
                    {order.invoice?.invoiceNumber || "Invoice pending"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label={order.status} color="primary" />
                  <Chip label={order.paymentStatus} variant="outlined" />
                </Stack>
              </Stack>
              <Typography>{order.shippingAddress}</Typography>
              {order.items?.map((item) => (
                <Typography key={item.id}>
                  {item.productName} × {item.quantity} = {item.lineTotal}
                </Typography>
              ))}
              <Typography variant="h6">Total: {order.totalAmount}</Typography>
              <TextField
                select
                size="small"
                label="Update Status"
                value={order.status}
                onChange={(event) =>
                  updateStatus(order.id || order._id, event.target.value).catch(
                    () => setError("Unable to update order status")
                  )
                }
                sx={{ maxWidth: 240 }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default Orders;
