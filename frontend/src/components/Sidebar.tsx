import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";

import {
  NavLink
} from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ArticleIcon from "@mui/icons-material/Article";
import BusinessIcon from "@mui/icons-material/Business";
import CampaignIcon from "@mui/icons-material/Campaign";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import HandshakeIcon from "@mui/icons-material/Handshake";
import HubIcon from "@mui/icons-material/Hub";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
  { label: "Analytics", to: "/analytics", icon: <AnalyticsIcon /> },
  { label: "Users", to: "/users", icon: <GroupIcon /> },
  { label: "Leads", to: "/leads", icon: <HandshakeIcon /> },
  { label: "Customers", to: "/customers", icon: <PeopleAltIcon /> },
  { label: "B2B Accounts", to: "/b2b/accounts", icon: <BusinessIcon /> },
  { label: "Products", to: "/products", icon: <StorefrontIcon /> },
  { label: "Inventory", to: "/inventory", icon: <InventoryIcon /> },
  { label: "Orders", to: "/orders", icon: <ReceiptLongIcon /> },
  { label: "CMS", to: "/cms", icon: <ArticleIcon /> },
  { label: "Commerce", to: "/commerce", icon: <LocalMallIcon /> },
  { label: "Marketing", to: "/marketing", icon: <CampaignIcon /> },
  { label: "Integrations", to: "/integrations", icon: <HubIcon /> },
  { label: "Profile", to: "/profile", icon: <PersonIcon /> },
  { label: "Settings", to: "/settings", icon: <SettingsIcon /> }
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(255, 255, 255, 0.16)",
          color: "#eaf8f6",
          background:
            "linear-gradient(180deg, #0f3f4f 0%, #155e75 54%, #164e63 100%)"
        }
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 3,
          borderBottom: "1px solid rgba(255, 255, 255, 0.14)"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900, color: "common.white" }}>
          COTECAE
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.68)" }}>
          CRM Commerce Suite
        </Typography>
      </Box>
      <List sx={{ px: 1.25, py: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              my: 0.35,
              borderRadius: 2,
              color: "rgba(255,255,255,0.78)",
              "& .MuiListItemIcon-root": {
                minWidth: 38,
                color: "rgba(255,255,255,0.70)"
              },
              "&.active": {
                color: "#ffffff",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.20), rgba(249,115,22,0.24))",
                boxShadow: "inset 3px 0 0 #fb923c"
              },
              "&.active .MuiListItemIcon-root": {
                color: "#ffffff"
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.12)"
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography component="span" sx={{ fontWeight: 700, fontSize: 14 }}>
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
