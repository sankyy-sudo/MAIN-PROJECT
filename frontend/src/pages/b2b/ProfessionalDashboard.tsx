import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/b2b/accounts/me/dashboard")
      .then((response) => setData(response.data.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Professional account not linked");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert
          severity="info"
          action={
            <Button color="inherit" onClick={() => navigate("/professional/request")}>
              Request access
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  const account = data.account;

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4">Professional dashboard</Typography>
            <Typography color="text.secondary">{account.companyName}</Typography>
          </Box>
          <Chip label={`${account.pricingTier} tier`} color="success" />
        </Box>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Discount</Typography>
              <Typography variant="h4">{Number(account.discountPercentage)}%</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Bulk ordering</Typography>
              <Typography variant="h6">{data.bulkOrdersEnabled ? "Enabled" : "Disabled"}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Invoice downloads</Typography>
              <Typography variant="h6">{data.invoiceDownloadEnabled ? "Enabled" : "Disabled"}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">Business details</Typography>
              <Typography>GST: {account.gstNumber}</Typography>
              <Typography>Contact: {account.contactPerson}</Typography>
              <Typography>Email: {account.email}</Typography>
              <Typography>Phone: {account.phone}</Typography>
              <Typography>Address: {account.businessAddress}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" onClick={() => navigate("/professional/bulk-order")}>
            Start bulk order
          </Button>
          <Button variant="outlined" onClick={() => navigate("/professional/invoices")}>
            Download invoices
          </Button>
          <Button variant="outlined" onClick={() => navigate("/store/products")}>
            Browse wholesale catalogue
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ProfessionalDashboard;
