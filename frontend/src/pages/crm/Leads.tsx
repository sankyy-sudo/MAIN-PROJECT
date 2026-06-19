import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useState
} from "react";
import type { ChangeEvent } from "react";
import api from "../../services/api";

interface Lead {
  _id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  notes?: string;
}

const leadForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "",
  status: "NEW",
  notes: ""
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(leadForm);

  const loadLeads = useCallback(async () => {
    const response = await api.get("/leads", {
      params: { search }
    });
    setLeads(response.data.data.leads);
  }, [search]);

  useEffect(() => {
    let active = true;

    api.get("/leads", {
      params: { search }
    }).then(response => {
      if (active) {
        setLeads(response.data.data.leads);
      }
    });

    return () => {
      active = false;
    };
  }, [search]);

  const changeField =
    (field: keyof typeof leadForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setForm({
        ...form,
        [field]: event.target.value
      });
    };

  const createLead = async () => {
    await api.post("/leads", form);
    setForm(leadForm);
    await loadLeads();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Leads
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Search"
          value={search}
          onChange={event =>
            setSearch(event.target.value)
          }
        />
        <Button
          variant="outlined"
          onClick={loadLeads}
        >
          Search
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={form.name}
              onChange={changeField("name")}
            />
            <TextField
              label="Company"
              value={form.company}
              onChange={changeField("company")}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={changeField("email")}
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={changeField("phone")}
            />
            <TextField
              label="Source"
              value={form.source}
              onChange={changeField("source")}
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={changeField("status")}
            >
              {[
                "NEW",
                "CONTACTED",
                "PROPOSAL_SENT",
                "NEGOTIATION",
                "WON",
                "LOST"
              ].map(status => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={form.notes}
              onChange={changeField("notes")}
            />
            <Button
              variant="contained"
              onClick={createLead}
            >
              Create Lead
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gap: 2
        }}
      >
        {leads.map(lead => (
          <Card key={lead._id}>
            <CardContent>
              <Typography variant="h6">
                {lead.name}
              </Typography>
              <Typography color="text.secondary">
                {lead.company} / {lead.status}
              </Typography>
              <Typography>
                {lead.email} {lead.phone}
              </Typography>
              <Typography>
                {lead.source}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default Leads;
