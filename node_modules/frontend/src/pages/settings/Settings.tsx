import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from "@mui/material";

const Settings = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Settings
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Company Name"
              defaultValue="COTECAE"
            />
            <TextField
              label="Support Email"
              defaultValue="support@cotecae.com"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Settings;
