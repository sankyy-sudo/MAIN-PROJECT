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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "ADMIN"
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(initialForm);

  const loadUsers = useCallback(async () => {
    const response = await api.get("/users");
    setUsers(response.data.data);
  }, []);

  useEffect(() => {
    let active = true;

    api.get("/users").then(response => {
      if (active) {
        setUsers(response.data.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const changeField =
    (field: keyof typeof initialForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setForm({
        ...form,
        [field]: event.target.value
      });
    };

  const createUser = async () => {
    await api.post("/users", form);
    setForm(initialForm);
    await loadUsers();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Users
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={form.name}
              onChange={changeField("name")}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={changeField("email")}
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={changeField("password")}
            />
            <TextField
              select
              label="Role"
              value={form.role}
              onChange={changeField("role")}
            >
              {[
                "SUPER_ADMIN",
                "ADMIN",
                "SALES_MANAGER",
                "INVENTORY_MANAGER",
                "SUPPORT"
              ].map(role => (
                <MenuItem
                  key={role}
                  value={role}
                >
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              onClick={createUser}
            >
              Create User
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
        {users.map(user => (
          <Card key={user._id}>
            <CardContent>
              <Typography variant="h6">
                {user.name}
              </Typography>
              <Typography color="text.secondary">
                {user.email}
              </Typography>
              <Typography>
                {user.role} / {user.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default Users;
