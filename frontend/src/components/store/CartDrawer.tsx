import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store";
import {
  removeCartItem,
  selectCartItems,
  selectSubtotal,
  updateCartItem
} from "../../store/slices/cartSlice";
import { formatCurrency } from "../../utils/format";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 380 }, p: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {items.length === 0 ? (
          <Stack spacing={2} sx={{ py: 8, alignItems: "center" }}>
            <ShoppingCartIcon sx={{ fontSize: 64, color: "text.secondary" }} />
            <Typography color="text.secondary">Your cart is empty</Typography>
            <Button variant="contained" onClick={() => go("/store/products")}>
              Shop Now
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Box key={item.id} sx={{ display: "flex", gap: 1.5 }}>
                <Box
                  component={item.product.images?.[0] ? "img" : "div"}
                  src={item.product.images?.[0]}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                    objectFit: "cover",
                    flexShrink: 0
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.product.sku}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(item.unitPrice)}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, alignItems: "center" }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        dispatch(
                          updateCartItem({
                            cartItemId: item.id,
                            quantity: item.quantity - 1
                          })
                        )
                      }
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        dispatch(
                          updateCartItem({
                            cartItemId: item.id,
                            quantity: item.quantity + 1
                          })
                        )
                      }
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        dispatch(removeCartItem({ cartItemId: item.id }))
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        {items.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack
              direction="row"
              sx={{ mb: 2, justifyContent: "space-between" }}
            >
              <Typography sx={{ fontWeight: 700 }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {formatCurrency(subtotal)}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Button variant="outlined" onClick={() => go("/cart")}>
                View Cart
              </Button>
              <Button variant="contained" onClick={() => go("/checkout")}>
                Checkout
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
