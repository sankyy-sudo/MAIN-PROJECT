import {
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";

const CustomerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((response) => setProfile(response.data.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h5">Profile</Typography>
        <Typography>Name: {profile?.name}</Typography>
        <Typography>Email: {profile?.email}</Typography>
        <Typography>Role: {profile?.role}</Typography>
        <Typography>Status: {profile?.status}</Typography>
      </Stack>
    </Paper>
  );
};

export default CustomerProfile;
