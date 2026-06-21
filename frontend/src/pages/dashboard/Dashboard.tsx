import {
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useEffect,
  useState
} from "react";

import api from "../../services/api";

interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalLeads: number;
  totalOrders: number;
  revenue: number;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats,setStats] =
    useState<DashboardStats>();

  useEffect(() => {

    api.get(
      "/dashboard/stats"
    )
    .then(res => {
      setStats(
        res.data.data
      );
    });

  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate("/analytics")}>
          View Analytics
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, 1fr)"
          }
        }}
      >
        {[
          ["Users", stats?.totalUsers],
          ["Customers", stats?.totalCustomers],
          ["Leads", stats?.totalLeads],
          ["Orders", stats?.totalOrders],
          ["Revenue", stats?.revenue]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <Typography color="text.secondary">
                {label}
              </Typography>

              <Typography variant="h4">
                {value ?? 0}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
