import VisibilityIcon from "@mui/icons-material/Visibility";
import {
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
      <CardMedia
        component={product.images?.[0] ? "img" : "div"}
        image={product.images?.[0]}
        sx={{ height: 220, bgcolor: "action.hover", objectFit: "cover" }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Chip
            label={status.replaceAll("_", " ")}
            color={getStockStatusColor(status)}
            size="small"
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.categoryDetails?.name || product.brandDetails?.name || product.sku}
          </Typography>
          <Typography variant="h6" color="primary">
            {formatCurrency(product.retailPrice)}
          </Typography>
          {product.wholesalePrice !== undefined && (
            <Typography variant="body2" color="text.secondary">
              Wholesale: {formatCurrency(product.wholesalePrice)}
            </Typography>
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          disabled={status === "OUT_OF_STOCK"}
          onClick={() => dispatch(addToCart({ productId: product.id, quantity: 1 }))}
        >
          Add to Cart
        </Button>
        <IconButton onClick={() => navigate(`/store/products/${product.id}`)}>
          <VisibilityIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
