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
import type { ChangeEvent } from "react";
import api from "../../services/api";

type MovementType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "RETURN";

interface Product {
  id: string;
  _id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  lowStockThreshold?: number;
}

interface Movement {
  id: string;
  _id: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: string;
  createdAt: string;
  productDetails?: Product;
  actor?: { name: string };
}

const emptyMovement = {
  productId: "",
  type: "STOCK_IN" as MovementType,
  quantity: "",
  reason: "",
  reference: ""
};

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [form, setForm] = useState(emptyMovement);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    const [productsResponse, lowStockResponse, movementsResponse] =
      await Promise.all([
        api.get("/products", { params: { limit: 100 } }),
        api.get("/inventory/low-stock"),
        api.get("/inventory/movements", { params: { limit: 50 } })
      ]);

    setProducts(productsResponse.data.data.products);
    setLowStock(lowStockResponse.data.data);
    setMovements(movementsResponse.data.data.movements);
  }, []);

  useEffect(() => {
    loadInventory().catch(() => {
      setError("Unable to load inventory");
    });
  }, [loadInventory]);

  const change =
    (field: keyof typeof emptyMovement) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const submitMovement = async () => {
    setError("");
    setMessage("");

    try {
      await api.post("/inventory/movements", {
        ...form,
        quantity: Number(form.quantity)
      });
      setForm(emptyMovement);
      setMessage("Stock movement recorded successfully");
      await loadInventory();
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message || "Unable to record movement"
      );
    }
  };

  const updateThreshold = async (product: Product, value: string) => {
    await api.put(`/inventory/thresholds/${product.id || product._id}`, {
      lowStockThreshold: Number(value)
    });
    await loadInventory();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Inventory Management</Typography>
        <Typography color="text.secondary">
          Track stock changes, low-stock alerts, and movement history.
        </Typography>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(320px, 1fr) 2fr" }
        }}
      >
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Record Stock Movement</Typography>
              <TextField
                select
                label="Product"
                value={form.productId}
                onChange={change("productId")}
              >
                {products.map((product) => (
                  <MenuItem
                    key={product.id || product._id}
                    value={product.id || product._id}
                  >
                    {product.name} ({product.sku}) — {product.stockQuantity}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Movement Type"
                value={form.type}
                onChange={change("type")}
              >
                <MenuItem value="STOCK_IN">Stock In</MenuItem>
                <MenuItem value="STOCK_OUT">Stock Out</MenuItem>
                <MenuItem value="ADJUSTMENT">Negative Adjustment</MenuItem>
                <MenuItem value="RETURN">Customer Return</MenuItem>
              </TextField>
              <TextField
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={change("quantity")}
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <TextField
                label="Reason"
                value={form.reason}
                onChange={change("reason")}
                required
              />
              <TextField
                label="Reference (optional)"
                value={form.reference}
                onChange={change("reference")}
              />
              <Button
                variant="contained"
                onClick={submitMovement}
                disabled={!form.productId || !form.quantity || !form.reason}
              >
                Save Movement
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                Low Stock Alerts ({lowStock.length})
              </Typography>
              {lowStock.length === 0 && (
                <Alert severity="success">All products are sufficiently stocked.</Alert>
              )}
              {lowStock.map((product) => (
                <Stack
                  key={product.id || product._id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    alignItems: { sm: "center" },
                    justifyContent: "space-between"
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.sku}
                    </Typography>
                  </Box>
                  <Chip
                    color={product.stockQuantity === 0 ? "error" : "warning"}
                    label={`${product.stockQuantity} available`}
                  />
                  <TextField
                    label="Alert at"
                    type="number"
                    size="small"
                    defaultValue={product.lowStockThreshold ?? 10}
                    onBlur={(event) =>
                      updateThreshold(product, event.target.value).catch(() =>
                        setError("Unable to update stock threshold")
                      )
                    }
                    sx={{ width: 120 }}
                  />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Stock Movement History</Typography>
            {movements.length === 0 && (
              <Typography color="text.secondary">
                No stock movements have been recorded.
              </Typography>
            )}
            {movements.map((movement) => (
              <Box
                key={movement.id || movement._id}
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "2fr 1fr 1fr 2fr 1fr"
                  },
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider"
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {movement.productDetails?.name || "Product"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movement.productDetails?.sku}
                  </Typography>
                </Box>
                <Chip label={movement.type.replaceAll("_", " ")} size="small" />
                <Typography>
                  {movement.previousQuantity} → {movement.newQuantity}
                </Typography>
                <Box>
                  <Typography>{movement.reason}</Typography>
                  {movement.reference && (
                    <Typography variant="body2" color="text.secondary">
                      Ref: {movement.reference}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2">
                    {movement.actor?.name || "System"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(movement.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Inventory;
