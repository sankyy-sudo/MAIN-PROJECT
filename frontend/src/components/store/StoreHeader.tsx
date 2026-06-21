import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { selectCartItemCount } from "../../store/slices/cartSlice";
import CartDrawer from "./CartDrawer";

const StoreHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const cartCount = useSelector(selectCartItemCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");

  const submitSearch = () => {
    setSearchAnchor(null);
    navigate(`/store/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            component={Link}
            to="/store"
            variant="h6"
            sx={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}
          >
            COTECAE
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mx: "auto" }}>
            <Button color="inherit" component={Link} to="/store/products">Shop</Button>
            <Button color="inherit" component={Link} to="/professional/dashboard">Professional</Button>
            <Button color="inherit" component={Link} to="/academy">Academy</Button>
            <Button color="inherit" component={Link} to="/store/about">About</Button>
            <Button color="inherit" component={Link} to="/store/contact">Contact</Button>
          </Box>

          <IconButton color="inherit" onClick={(event) => setSearchAnchor(event.currentTarget)}>
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user || token ? (
            <>
              <IconButton color="inherit" onClick={(event) => setAccountAnchor(event.currentTarget)}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={accountAnchor}
                open={Boolean(accountAnchor)}
                onClose={() => setAccountAnchor(null)}
              >
                <MenuItem onClick={() => navigate("/account/orders")}>My Orders</MenuItem>
                <MenuItem onClick={() => navigate("/account/profile")}>Profile</MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(logout());
                    setAccountAnchor(null);
                    navigate("/login");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(searchAnchor)}
        anchorEl={searchAnchor}
        onClose={() => setSearchAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box sx={{ p: 2, display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitSearch();
            }}
          />
          <Button variant="contained" onClick={submitSearch}>Search</Button>
        </Box>
      </Popover>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default StoreHeader;
