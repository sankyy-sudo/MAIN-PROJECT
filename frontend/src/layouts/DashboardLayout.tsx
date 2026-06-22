import {
  Outlet
} from "react-router-dom";

import {
  Box
} from "@mui/material";

import Sidebar
from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f7fbfa 0%, #eef8f6 48%, #fff7ed 100%)"
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          ml: "240px",
          minWidth: 0
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
