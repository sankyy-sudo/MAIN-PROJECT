import {
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  status: string;
}

const Profile = () => {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  useEffect(() => {
    api.get("/auth/profile").then(response => {
      setProfile(response.data.data);
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Profile
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">
            {profile?.name || "User"}
          </Typography>
          <Typography color="text.secondary">
            {profile?.email}
          </Typography>
          <Typography>
            {profile?.role} / {profile?.status}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Profile;
