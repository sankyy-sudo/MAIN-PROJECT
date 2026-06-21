import { Alert, Button, Stack } from "@mui/material";
import { useState } from "react";

const CookieConsent = () => {
  const [accepted, setAccepted] = useState(
    localStorage.getItem("cookieConsent") === "accepted"
  );

  if (accepted) return null;

  return (
    <Alert
      severity="info"
      sx={{ position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 1500 }}
      action={
        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              localStorage.setItem("cookieConsent", "accepted");
              setAccepted(true);
            }}
          >
            Accept
          </Button>
        </Stack>
      }
    >
      We use essential cookies for login, cart, security, and checkout.
    </Alert>
  );
};

export default CookieConsent;
