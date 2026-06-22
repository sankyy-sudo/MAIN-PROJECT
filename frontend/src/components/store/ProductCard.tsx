import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store";
import { addToCart } from "../../store/slices/cartSlice";
import type { IProduct } from "../../types/store";
import { formatCurrency, getStockStatusColor } from "../../utils/format";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = product.stockStatus || "IN_STOCK";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component={product.images?.[0] ? "img" : "div"}
          image={product.images?.[0]}
          sx={{
            height: 220,
            bgcolor: "rgba(21,94,117,0.08)",
            objectFit: "cover",
            transition: "transform 220ms ease",
            ".MuiCard-root:hover &": {
              transform: "scale(1.04)"
            }
          }}
        />
        <Chip
          label={status.replaceAll("_", " ")}
          color={getStockStatusColor(status)}
          size="small"
          sx={{
            position: "absolute",
            left: 14,
            top: 14,
            bgcolor: "rgba(255,255,255,0.92)"
          }}
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.categoryDetails?.name || product.brandDetails?.name || product.sku}
          </Typography>
          <Typography variant="h6" color="primary">
            {formatCurrency(product.b2bPrice ?? product.retailPrice)}
          </Typography>
          {product.b2bPrice !== undefined && (
            <Chip
              label={`${product.pricingTier || "B2B"} price`}
              color="success"
              size="small"
              sx={{ alignSelf: "flex-start" }}
            />
          )}
          {product.wholesalePrice !== undefined && (
            <Typography variant="body2" color="text.secondary">
              Wholesale: {formatCurrency(product.wholesalePrice)}
            </Typography>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={status === "OUT_OF_STOCK"}
          onClick={() => dispatch(addToCart({ productId: product.id, quantity: 1 }))}
        >
          Add to Cart
        </Button>
        <IconButton
          onClick={() => navigate(`/store/products/${product.id}`)}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
