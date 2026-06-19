import {
  Box,
  Button,
  Card,
  CardContent,
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

interface Customer {
  _id: string;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

const customerForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  notes: ""
};

const Customers = () => {
  const [customers, setCustomers] =
    useState<Customer[]>([]);
  const [form, setForm] =
    useState(customerForm);

  const loadCustomers = useCallback(async () => {
    const response = await api.get("/customers");
    setCustomers(
      response.data.data.customers
    );
  }, []);

  useEffect(() => {
    let active = true;

    api.get("/customers").then(response => {
      if (active) {
        setCustomers(
          response.data.data.customers
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const changeField =
    (field: keyof typeof customerForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setForm({
        ...form,
        [field]: event.target.value
      });
    };

  const createCustomer = async () => {
    await api.post("/customers", form);
    setForm(customerForm);
    await loadCustomers();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Customers
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Company Name"
              value={form.companyName}
              onChange={changeField("companyName")}
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
              label="Address"
              value={form.address}
              onChange={changeField("address")}
            />
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={form.notes}
              onChange={changeField("notes")}
            />
            <Button
              variant="contained"
              onClick={createCustomer}
            >
              Create Customer
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
        {customers.map(customer => (
          <Card key={customer._id}>
            <CardContent>
              <Typography variant="h6">
                {customer.companyName}
              </Typography>
              <Typography color="text.secondary">
                {customer.contactPerson}
              </Typography>
              <Typography>
                {customer.email} {customer.phone}
              </Typography>
              <Typography>
                {customer.address}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default Customers;
