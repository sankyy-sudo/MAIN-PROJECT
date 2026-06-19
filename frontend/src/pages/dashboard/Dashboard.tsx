import {
  Box,
  Card,
  CardContent,
  Typography
} from "@mui/material";

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
  );
};

export default Dashboard;
