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
        minHeight: "100vh"
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          ml: "240px"
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
