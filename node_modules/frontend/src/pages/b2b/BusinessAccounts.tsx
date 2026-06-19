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

interface BusinessAccount {
  _id: string;
  companyName: string;
  gstNumber: string;
  businessAddress: string;
  contactPerson: string;
  email: string;
  phone: string;
  pricingTier: string;
  discountPercentage: number;
}

const accountForm = {
  companyName: "",
  gstNumber: "",
  businessAddress: "",
  contactPerson: "",
  email: "",
  phone: "",
  pricingTier: "SILVER",
  discountPercentage: "5"
};

const BusinessAccounts = () => {
  const [accounts, setAccounts] =
    useState<BusinessAccount[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] =
    useState(accountForm);

  const loadAccounts = useCallback(async () => {
    const response =
      await api.get("/b2b/accounts", {
        params: { search }
      });

    setAccounts(response.data.data.accounts);
  }, [search]);

  useEffect(() => {
    let active = true;

    api.get("/b2b/accounts", {
      params: { search }
    }).then(response => {
      if (active) {
        setAccounts(
          response.data.data.accounts
        );
      }
    });

    return () => {
      active = false;
    };
  }, [search]);

  const changeField =
    (field: keyof typeof accountForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setForm({
        ...form,
        [field]: event.target.value
      });
    };

  const createAccount = async () => {
    await api.post("/b2b/accounts", {
      ...form,
      discountPercentage:
        Number(form.discountPercentage)
    });
    setForm(accountForm);
    await loadAccounts();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        B2B Accounts
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
          onClick={loadAccounts}
        >
          Search
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Company Name"
              value={form.companyName}
              onChange={changeField("companyName")}
            />
            <TextField
              label="GST Number"
              value={form.gstNumber}
              onChange={changeField("gstNumber")}
            />
            <TextField
              label="Business Address"
              value={form.businessAddress}
              onChange={changeField("businessAddress")}
            />
            <TextField
              label="Contact Person"
              value={form.contactPerson}
              onChange={changeField("contactPerson")}
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
              select
              label="Pricing Tier"
              value={form.pricingTier}
              onChange={changeField("pricingTier")}
            >
              {["SILVER", "GOLD", "PLATINUM"].map(
                tier => (
                  <MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              label="Discount %"
              type="number"
              value={form.discountPercentage}
              onChange={changeField(
                "discountPercentage"
              )}
            />
            <Button
              variant="contained"
              onClick={createAccount}
            >
              Create B2B Account
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
        {accounts.map(account => (
          <Card key={account._id}>
            <CardContent>
              <Typography variant="h6">
                {account.companyName}
              </Typography>
              <Typography color="text.secondary">
                {account.pricingTier} /{" "}
                {account.discountPercentage}% discount
              </Typography>
              <Typography>
                GST: {account.gstNumber}
              </Typography>
              <Typography>
                {account.contactPerson} /{" "}
                {account.email} / {account.phone}
              </Typography>
              <Typography>
                {account.businessAddress}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default BusinessAccounts;
