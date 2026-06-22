import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 4 },
          color: "common.white",
          borderRadius: 2,
          background:
            "linear-gradient(135deg, #0f3f4f 0%, #155e75 58%, #f97316 140%)",
          boxShadow: "0 24px 64px rgba(16, 32, 39, 0.16)"
        }}
      >
        <Chip
          label="Live CRM Overview"
          color="secondary"
          sx={{ mb: 2, bgcolor: "rgba(249,115,22,0.92)" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
          <Box>
            <Typography variant="h4" sx={{ color: "common.white" }}>Dashboard</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.74)", mt: 0.75 }}>
              Track customers, leads, orders, and revenue from one control room.
            </Typography>
          </Box>
          <Button variant="contained" color="secondary" onClick={() => navigate("/analytics")}>
            View Analytics
          </Button>
        </Box>
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

              <Typography variant="h4" sx={{ mt: 1, color: "primary.dark" }}>
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
