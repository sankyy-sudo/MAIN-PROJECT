import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import api from "../../services/api";

const campaignForm = {
  name: "",
  subject: "",
  previewText: "",
  body: "",
  status: "DRAFT"
};

const MarketingAdmin = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [campaign, setCampaign] = useState(campaignForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [subscriberRes, campaignRes, logRes] = await Promise.all([
      api.get("/marketing/newsletter/subscribers"),
      api.get("/marketing/campaigns"),
      api.get("/marketing/automation/logs")
    ]);
    setSubscribers(subscriberRes.data.data);
    setCampaigns(campaignRes.data.data);
    setLogs(logRes.data.data);
  }, []);

  useEffect(() => {
    load().catch(() => setError("Unable to load marketing data"));
  }, [load]);

  const change =
    (field: keyof typeof campaignForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setCampaign({ ...campaign, [field]: event.target.value });
    };

  const createCampaign = async () => {
    await api.post("/marketing/campaigns", campaign);
    setCampaign(campaignForm);
    setMessage("Campaign placeholder saved");
    await load();
  };

  const runAbandonedCart = async () => {
    const response = await api.post("/marketing/automation/abandoned-cart/run", {
      olderThanHours: 24,
      limit: 50
    });
    setMessage(
      `Abandoned cart job scanned ${response.data.data.scanned} carts and sent ${response.data.data.sentCount} emails`
    );
    await load();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Emails & Newsletter</Typography>
        <Typography color="text.secondary">
          Manage newsletter subscribers, campaign placeholders, and automation jobs.
        </Typography>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Campaign Placeholder</Typography>
              <TextField label="Name" value={campaign.name} onChange={change("name")} />
              <TextField label="Subject" value={campaign.subject} onChange={change("subject")} />
              <TextField label="Preview Text" value={campaign.previewText} onChange={change("previewText")} />
              <TextField label="Body" multiline minRows={5} value={campaign.body} onChange={change("body")} />
              <TextField select label="Status" value={campaign.status} onChange={change("status")}>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="PAUSED">Paused</MenuItem>
              </TextField>
              <Button variant="contained" onClick={createCampaign}>Save Campaign</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Abandoned Cart Email Job</Typography>
              <Typography color="text.secondary">
                Sends one reminder per cart per 24 hours for signed-in customers with carts older than 24 hours.
              </Typography>
              <Button variant="contained" onClick={runAbandonedCart}>
                Run Abandoned Cart Job
              </Button>
              <Typography variant="h6">Automation Logs</Typography>
              {logs.slice(0, 8).map((log) => (
                <Typography key={log.id}>
                  {log.type} / {log.recipient} / {log.status}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6">Newsletter Subscribers ({subscribers.length})</Typography>
          {subscribers.map((subscriber) => (
            <Typography key={subscriber.id} sx={{ py: 0.5 }}>
              {subscriber.email} / {subscriber.name || "No name"} / {subscriber.status}
            </Typography>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Campaigns ({campaigns.length})</Typography>
          {campaigns.map((item) => (
            <Typography key={item.id} sx={{ py: 0.5 }}>
              {item.name} / {item.subject} / {item.status}
            </Typography>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default MarketingAdmin;
