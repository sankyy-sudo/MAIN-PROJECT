import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";

const IntegrationsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/integrations/status")
      .then((response) => setItems(response.data.data))
      .catch(() => setError("Unable to load integrations"));
  }, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Third-party Integrations</Typography>
        <Typography color="text.secondary">
          Track payment, email, analytics, maps, shipping, security, chat, and reviews configuration.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" } }}>
        {items.map((item) => (
          <Card key={item.key}>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Chip
                    label={item.configured ? "Configured" : "Missing env"}
                    color={item.configured ? "success" : "warning"}
                    size="small"
                  />
                </Stack>
                <Typography color="text.secondary">{item.category}</Typography>
                <Typography variant="body2">
                  Required: {item.requiredEnv.join(", ")}
                </Typography>
                {item.optionalEnv?.length > 0 && (
                  <Typography variant="body2">
                    Optional: {item.optionalEnv.join(", ")}
                  </Typography>
                )}
                {item.notes && (
                  <Typography variant="body2" color="text.secondary">
                    {item.notes}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default IntegrationsAdmin;
