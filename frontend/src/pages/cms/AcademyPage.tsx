import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import api from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  company: "",
  interest: ""
};

const AcademyPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/public/cms/settings", { params: { group: "ACADEMY" } })
      .then((response) => {
        const values = response.data.data.reduce(
          (items: Record<string, string>, setting: any) => ({
            ...items,
            [setting.key]: setting.value
          }),
          {}
        );
        setSettings(values);
      })
      .catch(() => setSettings({}));
  }, []);

  const change =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };

  const submit = async () => {
    setError("");
    setMessage("");
    try {
      await api.post("/public/cms/academy/waitlist", form);
      setForm(initialForm);
      setMessage("You are on the Academy waitlist.");
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message || "Unable to join waitlist"
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" } }}>
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {settings.teaserTitle || "COTECAE Academy"}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18 }}>
            {settings.teaserDescription ||
              "Join product workshops, professional retail training, and launch updates."}
          </Typography>
          <Typography color="primary" sx={{ fontWeight: 700 }}>
            {settings.launchStatus || "WAITLIST_OPEN"}
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Join the waitlist</Typography>
              {message && <Alert severity="success">{message}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <TextField label="Name" value={form.name} onChange={change("name")} />
              <TextField label="Email" value={form.email} onChange={change("email")} />
              <TextField label="Company" value={form.company} onChange={change("company")} />
              <TextField
                label="Interest"
                multiline
                minRows={3}
                value={form.interest}
                onChange={change("interest")}
              />
              <Button
                variant="contained"
                onClick={submit}
                disabled={!form.name || !form.email}
              >
                Join Waitlist
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AcademyPage;
