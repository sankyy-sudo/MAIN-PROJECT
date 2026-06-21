import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import api from "../../services/api";

const bannerForm = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  portal: "RETAIL",
  placement: "HOME_HERO",
  sortOrder: "0",
  isActive: true
};

const pageForm = {
  title: "",
  slug: "",
  type: "LANDING",
  summary: "",
  body: "",
  heroImageUrl: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  isPublished: false
};

const postForm = {
  title: "",
  slug: "",
  type: "BLOG",
  excerpt: "",
  body: "",
  imageUrl: "",
  authorName: "",
  seoTitle: "",
  seoDescription: "",
  isPublished: false
};

const seoForm = {
  defaultTitle: "",
  defaultDescription: "",
  defaultKeywords: ""
};

const socialForm = {
  instagramUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  xUrl: ""
};

const academyForm = {
  teaserTitle: "COTECAE Academy",
  teaserDescription: "",
  launchStatus: "WAITLIST_OPEN"
};

const CmsAdmin = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [banner, setBanner] = useState(bannerForm);
  const [page, setPage] = useState(pageForm);
  const [post, setPost] = useState(postForm);
  const [seo, setSeo] = useState(seoForm);
  const [social, setSocial] = useState(socialForm);
  const [academy, setAcademy] = useState(academyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCms = useCallback(async () => {
    const [bannerRes, pageRes, postRes, waitlistRes, settingsRes] =
      await Promise.all([
        api.get("/cms/banners"),
        api.get("/cms/pages"),
        api.get("/cms/posts"),
        api.get("/cms/academy/waitlist"),
        api.get("/cms/settings")
      ]);

    setBanners(bannerRes.data.data);
    setPages(pageRes.data.data);
    setPosts(postRes.data.data);
    setWaitlist(waitlistRes.data.data);

    const settings = settingsRes.data.data as any[];
    const valuesFor = (group: string) =>
      settings
        .filter((setting) => setting.group === group)
        .reduce((values, setting) => ({
          ...values,
          [setting.key]: setting.value
        }), {});

    setSeo((current) => ({ ...current, ...valuesFor("SEO") }));
    setSocial((current) => ({ ...current, ...valuesFor("SOCIAL") }));
    setAcademy((current) => ({ ...current, ...valuesFor("ACADEMY") }));
  }, []);

  useEffect(() => {
    loadCms().catch(() => setError("Unable to load CMS data"));
  }, [loadCms]);

  const change =
    <T extends Record<string, any>>(
      setter: (value: T) => void,
      current: T,
      field: keyof T
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setter({ ...current, [field]: value });
    };

  const createBanner = async () => {
    await api.post("/cms/banners", {
      ...banner,
      sortOrder: Number(banner.sortOrder)
    });
    setBanner(bannerForm);
    setMessage("Banner saved");
    await loadCms();
  };

  const createPage = async () => {
    await api.post("/cms/pages", page);
    setPage(pageForm);
    setMessage("Page saved");
    await loadCms();
  };

  const createPost = async () => {
    await api.post("/cms/posts", post);
    setPost(postForm);
    setMessage("Content saved");
    await loadCms();
  };

  const saveSettings = async (group: string, values: Record<string, string>) => {
    await api.put("/cms/settings", { group, values });
    setMessage(`${group} settings saved`);
    await loadCms();
  };

  const remove = async (url: string) => {
    await api.delete(url);
    setMessage("Item deleted");
    await loadCms();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">CMS Admin</Typography>
        <Typography color="text.secondary">
          Manage banners, pages, content, academy waitlist, SEO, and social settings.
        </Typography>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Banner Management</Typography>
              <TextField label="Title" value={banner.title} onChange={change(setBanner, banner, "title")} />
              <TextField label="Subtitle" value={banner.subtitle} onChange={change(setBanner, banner, "subtitle")} />
              <TextField label="Image URL" value={banner.imageUrl} onChange={change(setBanner, banner, "imageUrl")} />
              <TextField label="CTA Label" value={banner.ctaLabel} onChange={change(setBanner, banner, "ctaLabel")} />
              <TextField label="CTA URL" value={banner.ctaUrl} onChange={change(setBanner, banner, "ctaUrl")} />
              <TextField select label="Portal" value={banner.portal} onChange={change(setBanner, banner, "portal")}>
                <MenuItem value="RETAIL">Retail</MenuItem>
                <MenuItem value="PROFESSIONAL">Professional</MenuItem>
              </TextField>
              <TextField select label="Placement" value={banner.placement} onChange={change(setBanner, banner, "placement")}>
                <MenuItem value="HOME_HERO">Home Hero</MenuItem>
                <MenuItem value="CATEGORY">Category</MenuItem>
                <MenuItem value="PRODUCT">Product</MenuItem>
                <MenuItem value="CHECKOUT">Checkout</MenuItem>
              </TextField>
              <TextField label="Sort Order" type="number" value={banner.sortOrder} onChange={change(setBanner, banner, "sortOrder")} />
              <FormControlLabel
                control={<Checkbox checked={banner.isActive} onChange={change(setBanner, banner, "isActive")} />}
                label="Active"
              />
              <Button variant="contained" onClick={createBanner}>Save Banner</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Page / Landing Page Management</Typography>
              <TextField label="Title" value={page.title} onChange={change(setPage, page, "title")} />
              <TextField label="Slug" value={page.slug} onChange={change(setPage, page, "slug")} />
              <TextField select label="Type" value={page.type} onChange={change(setPage, page, "type")}>
                <MenuItem value="LANDING">Landing</MenuItem>
                <MenuItem value="STATIC">Static</MenuItem>
                <MenuItem value="PRIVACY">Privacy</MenuItem>
                <MenuItem value="TERMS">Terms</MenuItem>
              </TextField>
              <TextField label="Summary" value={page.summary} onChange={change(setPage, page, "summary")} />
              <TextField label="Body" multiline minRows={5} value={page.body} onChange={change(setPage, page, "body")} />
              <TextField label="Hero Image URL" value={page.heroImageUrl} onChange={change(setPage, page, "heroImageUrl")} />
              <TextField label="SEO Title" value={page.seoTitle} onChange={change(setPage, page, "seoTitle")} />
              <TextField label="SEO Description" value={page.seoDescription} onChange={change(setPage, page, "seoDescription")} />
              <TextField label="SEO Keywords" value={page.seoKeywords} onChange={change(setPage, page, "seoKeywords")} />
              <FormControlLabel
                control={<Checkbox checked={page.isPublished} onChange={change(setPage, page, "isPublished")} />}
                label="Published"
              />
              <Button variant="contained" onClick={createPage}>Save Page</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Blog / News / Recipe Management</Typography>
              <TextField label="Title" value={post.title} onChange={change(setPost, post, "title")} />
              <TextField label="Slug" value={post.slug} onChange={change(setPost, post, "slug")} />
              <TextField select label="Type" value={post.type} onChange={change(setPost, post, "type")}>
                <MenuItem value="BLOG">Blog</MenuItem>
                <MenuItem value="NEWS">News</MenuItem>
                <MenuItem value="RECIPE">Recipe</MenuItem>
              </TextField>
              <TextField label="Excerpt" value={post.excerpt} onChange={change(setPost, post, "excerpt")} />
              <TextField label="Body" multiline minRows={5} value={post.body} onChange={change(setPost, post, "body")} />
              <TextField label="Image URL" value={post.imageUrl} onChange={change(setPost, post, "imageUrl")} />
              <TextField label="Author" value={post.authorName} onChange={change(setPost, post, "authorName")} />
              <TextField label="SEO Title" value={post.seoTitle} onChange={change(setPost, post, "seoTitle")} />
              <TextField label="SEO Description" value={post.seoDescription} onChange={change(setPost, post, "seoDescription")} />
              <FormControlLabel
                control={<Checkbox checked={post.isPublished} onChange={change(setPost, post, "isPublished")} />}
                label="Published"
              />
              <Button variant="contained" onClick={createPost}>Save Content</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">SEO / Social / Academy Settings</Typography>
              <TextField label="Default SEO Title" value={seo.defaultTitle} onChange={change(setSeo, seo, "defaultTitle")} />
              <TextField label="Default SEO Description" value={seo.defaultDescription} onChange={change(setSeo, seo, "defaultDescription")} />
              <TextField label="Default SEO Keywords" value={seo.defaultKeywords} onChange={change(setSeo, seo, "defaultKeywords")} />
              <Button variant="outlined" onClick={() => saveSettings("SEO", seo)}>Save SEO</Button>
              <TextField label="Instagram URL" value={social.instagramUrl} onChange={change(setSocial, social, "instagramUrl")} />
              <TextField label="Facebook URL" value={social.facebookUrl} onChange={change(setSocial, social, "facebookUrl")} />
              <TextField label="LinkedIn URL" value={social.linkedinUrl} onChange={change(setSocial, social, "linkedinUrl")} />
              <TextField label="YouTube URL" value={social.youtubeUrl} onChange={change(setSocial, social, "youtubeUrl")} />
              <TextField label="X URL" value={social.xUrl} onChange={change(setSocial, social, "xUrl")} />
              <Button variant="outlined" onClick={() => saveSettings("SOCIAL", social)}>Save Social</Button>
              <TextField label="Academy Teaser Title" value={academy.teaserTitle} onChange={change(setAcademy, academy, "teaserTitle")} />
              <TextField label="Academy Teaser Description" multiline minRows={3} value={academy.teaserDescription} onChange={change(setAcademy, academy, "teaserDescription")} />
              <TextField label="Launch Status" value={academy.launchStatus} onChange={change(setAcademy, academy, "launchStatus")} />
              <Button variant="outlined" onClick={() => saveSettings("ACADEMY", academy)}>Save Academy</Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h6">Managed Content</Typography>
        {[...banners.map((item) => ({ ...item, kind: "Banner", url: `/cms/banners/${item.id}` })),
          ...pages.map((item) => ({ ...item, kind: "Page", url: `/cms/pages/${item.id}` })),
          ...posts.map((item) => ({ ...item, kind: "Post", url: `/cms/posts/${item.id}` }))].map((item) => (
          <Card key={`${item.kind}-${item.id}`}>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{item.kind}: {item.title}</Typography>
                  <Typography color="text.secondary">
                    {item.portal || item.type} {item.slug ? `/ ${item.slug}` : ""}
                  </Typography>
                </Box>
                <Button color="error" variant="outlined" onClick={() => remove(item.url)}>
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6">Academy Waitlist ({waitlist.length})</Typography>
          {waitlist.map((entry) => (
            <Typography key={entry.id} sx={{ py: 0.5 }}>
              {entry.name} / {entry.email} / {entry.company || "No company"}
            </Typography>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CmsAdmin;
