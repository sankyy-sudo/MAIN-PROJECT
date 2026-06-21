import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import type { AppDispatch } from "../../store";
import { addToCart, fetchCart } from "../../store/slices/cartSlice";
import type { IProduct } from "../../types/store";
import { formatCurrency } from "../../utils/format";

const BulkOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/public/products", { params: { limit: 100, inStock: true } })
      .then((response) => setProducts(response.data.data.products))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  const addBulkToCart = async () => {
    setMessage("");
    setError("");
    const selected = Object.entries(quantities).filter(([, quantity]) => quantity > 0);
    if (!selected.length) {
      setError("Enter quantity for at least one product");
      return;
    }
    try {
      for (const [productId, quantity] of selected) {
        await dispatch(addToCart({ productId, quantity })).unwrap();
      }
      await dispatch(fetchCart());
      setMessage("Bulk items added to cart");
    } catch (requestError: any) {
      setError(requestError.message || "Unable to add bulk items");
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">Bulk order</Typography>
        <Typography color="text.secondary">
          Add multiple wholesale products to your cart in one pass.
        </Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        {products.map((product) => (
          <Paper key={product.id} sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
            >
              <Stack>
                <Typography sx={{ fontWeight: 700 }}>{product.name}</Typography>
                <Typography color="text.secondary">SKU: {product.sku}</Typography>
                <Typography color="primary">
                  {formatCurrency(product.b2bPrice ?? product.wholesalePrice ?? product.retailPrice)}
                </Typography>
              </Stack>
              <TextField
                label="Qty"
                type="number"
                value={quantities[product.id] || ""}
                onChange={(event) =>
                  setQuantities({
                    ...quantities,
                    [product.id]: Math.max(Number(event.target.value), 0)
                  })
                }
                slotProps={{ htmlInput: { min: 0, max: product.stockQuantity } }}
                sx={{ width: 140 }}
              />
            </Stack>
          </Paper>
        ))}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={addBulkToCart}
          >
            Add selected to cart
          </Button>
          <Button variant="outlined" onClick={() => navigate("/cart")}>
            Go to cart
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default BulkOrderPage;
