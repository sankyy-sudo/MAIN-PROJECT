import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "../../services/api";
import { formatCurrency } from "../../utils/format";

const colors = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#d32f2f", "#0288d1"];

const ChartCard = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ width: "100%", height: 300 }}>{children}</Box>
      </Stack>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then((response) => setData(response.data.data))
      .catch(() => setError("Unable to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const kpis = [
    ["Delivered Revenue", formatCurrency(data.revenue.deliveredRevenue)],
    ["Paid Revenue", formatCurrency(data.revenue.paidRevenue)],
    ["Lead Win Rate", `${data.conversion.leadWinRate}%`],
    ["New Customers 30d", data.customers.newCustomers30d]
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <Typography color="text.secondary">
          Revenue, products, conversion, customers, sales, and lead analytics.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        {kpis.map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <Typography color="text.secondary">{label}</Typography>
              <Typography variant="h5">{value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" } }}>
        <ChartCard title="Revenue Analytics">
          <ResponsiveContainer>
            <LineChart data={data.revenue.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Products">
          <ResponsiveContainer>
            <BarChart data={data.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="revenue" fill="#2e7d32" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Analytics">
          <ResponsiveContainer>
            <BarChart data={data.customers.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#ed6c02" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales Analytics">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data.sales.byStatus} dataKey="orders" nameKey="status" outerRadius={100} label>
                {data.sales.byStatus.map((_: any, index: number) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Conversion Analytics">
          <ResponsiveContainer>
            <BarChart data={data.leads.byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#9c27b0" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Sources">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data.leads.bySource} dataKey="count" nameKey="source" outerRadius={100} label>
                {data.leads.bySource.map((_: any, index: number) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Stack>
  );
};

export default AnalyticsDashboard;
