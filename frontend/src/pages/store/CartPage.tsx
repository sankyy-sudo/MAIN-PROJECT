import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store";
import {
  removeCartItem,
  selectCartItemCount,
  selectCartItems,
  selectDiscount,
  selectSubtotal,
  updateCartItem
} from "../../store/slices/cartSlice";
import { formatCurrency } from "../../utils/format";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const token = localStorage.getItem("token");

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" } }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Your Cart ({count} items)
          </Typography>
          {items.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <ShoppingCartIcon sx={{ fontSize: 72, color: "text.secondary" }} />
              <Typography variant="h6">Your cart is empty</Typography>
              <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/store/products")}>
                Start Shopping
              </Button>
            </Paper>
          ) : (
            items.map((item) => (
              <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "80px 1fr", md: "80px 1fr 120px 160px 48px" }, alignItems: "center" }}>
                  <Box component={item.product.images?.[0] ? "img" : "div"} src={item.product.images?.[0]} sx={{ width: 80, height: 80, objectFit: "cover", bgcolor: "action.hover", borderRadius: 1 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.product.name}
                    </Typography>
                    <Typography color="text.secondary">{item.product.sku}</Typography>
                  </Box>
                  <Typography>{formatCurrency(item.unitPrice)}</Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={item.quantity}
                    onChange={(event) =>
                      dispatch(updateCartItem({ cartItemId: item.id, quantity: Number(event.target.value) }))
                    }
                  />
                  <IconButton color="error" onClick={() => dispatch(removeCartItem({ cartItemId: item.id }))}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Order Summary</Typography>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography>Subtotal</Typography>
                <Typography>{formatCurrency(subtotal)}</Typography>
              </Stack>
              {discount > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between", color: "success.main" }}>
                  <Typography>Discount</Typography>
                  <Typography>-{formatCurrency(discount)}</Typography>
                </Stack>
              )}
              <Typography color="text.secondary">Shipping calculated at checkout</Typography>
              <Typography color="text.secondary">VAT calculated at checkout</Typography>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700 }}>Estimated Total</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(subtotal - discount)}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                disabled={items.length === 0}
                onClick={() => navigate(token ? "/checkout" : "/login?redirect=/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CartPage;
