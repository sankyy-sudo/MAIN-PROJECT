import {
  Drawer,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";

import {
  Link
} from "react-router-dom";

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box"
        }
      }}
    >
      <List>

        <ListItemButton
          component={Link}
          to="/dashboard"
        >
          <ListItemText
            primary="Dashboard"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/analytics"
        >
          <ListItemText
            primary="Analytics"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/users"
        >
          <ListItemText
            primary="Users"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/leads"
        >
          <ListItemText
            primary="Leads"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/customers"
        >
          <ListItemText
            primary="Customers"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/b2b/accounts"
        >
          <ListItemText
            primary="B2B Accounts"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/products"
        >
          <ListItemText
            primary="Products"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/inventory"
        >
          <ListItemText
            primary="Inventory"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/orders"
        >
          <ListItemText
            primary="Orders"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/cms"
        >
          <ListItemText
            primary="CMS"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/commerce"
        >
          <ListItemText
            primary="Commerce"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/marketing"
        >
          <ListItemText
            primary="Marketing"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/integrations"
        >
          <ListItemText
            primary="Integrations"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/profile"
        >
          <ListItemText
            primary="Profile"
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/settings"
        >
          <ListItemText
            primary="Settings"
          />
        </ListItemButton>

      </List>
    </Drawer>
  );
};

export default Sidebar;
