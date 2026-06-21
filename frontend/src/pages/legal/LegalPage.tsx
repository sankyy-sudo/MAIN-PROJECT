import { Container, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const fallback: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: "We collect only the data needed to operate accounts, orders, payments, support, marketing preferences, and security controls."
  },
  terms: {
    title: "Terms and Conditions",
    body: "Use of this site is subject to account, ordering, payment, returns, acceptable-use, and intellectual-property terms."
  }
};

const LegalPage = () => {
  const { slug = "privacy" } = useParams();
  const [page, setPage] = useState(fallback[slug] || fallback.privacy);

  useEffect(() => {
    api
      .get(`/public/cms/pages/${slug}`)
      .then((response) => setPage(response.data.data))
      .catch(() => setPage(fallback[slug] || fallback.privacy));
  }, [slug]);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4">{page.title}</Typography>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{page.body}</Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LegalPage;
