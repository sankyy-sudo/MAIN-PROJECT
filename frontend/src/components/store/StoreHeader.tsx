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
      <AppBar
        position="sticky"
        color="transparent"
        sx={{
          backdropFilter: "blur(18px)",
          background:
            "linear-gradient(135deg, rgba(15,63,79,0.94), rgba(21,94,117,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.14)"
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Typography
            component={Link}
            to="/store"
            variant="h6"
            sx={{
              color: "common.white",
              textDecoration: "none",
              fontWeight: 900,
              mr: 2
            }}
          >
            COTECAE
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, mx: "auto" }}>
            {[
              ["Shop", "/store/products"],
              ["Professional", "/professional/dashboard"],
              ["Academy", "/academy"],
              ["About", "/store/about"],
              ["Contact", "/store/contact"]
            ].map(([label, to]) => (
              <Button
                key={to}
                color="inherit"
                component={Link}
                to={to}
                sx={{
                  color: "rgba(255,255,255,0.82)",
                  px: 1.5,
                  "&:hover": {
                    color: "common.white",
                    backgroundColor: "rgba(255,255,255,0.12)"
                  }
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <IconButton
            color="inherit"
            onClick={(event) => setSearchAnchor(event.currentTarget)}
            sx={{ color: "common.white" }}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ color: "common.white" }}
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user || token ? (
            <>
              <IconButton
                color="inherit"
                onClick={(event) => setAccountAnchor(event.currentTarget)}
                sx={{ color: "common.white" }}
              >
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
              <Button sx={{ color: "common.white" }} component={Link} to="/login">Login</Button>
              <Button variant="contained" color="secondary" component={Link} to="/register">
                Register
              </Button>
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
        <Box sx={{ p: 2, display: "flex", gap: 1, minWidth: 360 }}>
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
