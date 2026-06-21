import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "../../store";
import { addToCart } from "../../store/slices/cartSlice";
import api from "../../services/api";
import type { IProduct } from "../../types/store";
import { formatCurrency, getStockStatusColor } from "../../utils/format";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/public/products/${id}`)
      .then((response) => setProduct(response.data.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Product not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error || "Product not found"}</Alert>
      </Container>
    );
  }

  const status = product.stockStatus || "IN_STOCK";
  const image = product.images?.[0];

  return (
    <Container maxWidth="lg">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        <Paper
          component={image ? "img" : "div"}
          src={image}
          sx={{
            width: "100%",
            minHeight: 420,
            objectFit: "cover",
            bgcolor: "action.hover",
            borderRadius: 2
          }}
        />
        <Stack spacing={2}>
          <Chip
            label={status.replaceAll("_", " ")}
            color={getStockStatusColor(status)}
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="h3">{product.name}</Typography>
          <Typography color="text.secondary">SKU: {product.sku}</Typography>
          <Typography variant="h4" color="primary">
            {formatCurrency(product.b2bPrice ?? product.retailPrice)}
          </Typography>
          {product.b2bPrice !== undefined && (
            <Alert severity="success">
              Professional {product.pricingTier} pricing applied
              {product.discountPercentage !== undefined
                ? ` (${product.discountPercentage}% discount)`
                : ""}
            </Alert>
          )}
          {product.wholesalePrice !== undefined && (
            <Typography color="text.secondary">
              Wholesale price: {formatCurrency(product.wholesalePrice)}
            </Typography>
          )}
          <Divider />
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {product.description || "No description available yet."}
          </Typography>
          <Typography color="text.secondary">
            Category: {product.categoryDetails?.name || "Uncategorised"}
          </Typography>
          <Typography color="text.secondary">
            Brand: {product.brandDetails?.name || "Unbranded"}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(Number(event.target.value), 1))}
              slotProps={{
                htmlInput: { min: 1, max: product.stockQuantity }
              }}
              sx={{ maxWidth: 140 }}
            />
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              disabled={status === "OUT_OF_STOCK"}
              onClick={() => dispatch(addToCart({ productId: product.id, quantity }))}
            >
              Add to cart
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
