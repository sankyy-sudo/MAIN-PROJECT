import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatCurrency } from "../../utils/format";

const B2BInvoicesPage = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/b2b/accounts/me/invoices")
      .then((response) => setInvoices(response.data.data || []))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load invoices");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">B2B invoices</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && invoices.length === 0 && (
          <Alert severity="info">No invoices are available yet.</Alert>
        )}
        {invoices.map((invoice) => (
          <Paper key={invoice.id} sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}
            >
              <Stack>
                <Typography sx={{ fontWeight: 700 }}>
                  {invoice.invoiceNumber}
                </Typography>
                <Typography color="text.secondary">
                  Order: {invoice.order?.orderNumber}
                </Typography>
                <Typography color="text.secondary">
                  Status: {invoice.order?.status}
                </Typography>
              </Stack>
              <Typography sx={{ fontWeight: 700 }}>
                {formatCurrency(invoice.amount)}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => window.print()}
              >
                Print / Save PDF
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default B2BInvoicesPage;
