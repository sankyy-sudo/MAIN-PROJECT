import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/store/ProductCard";
import type { IBrand, ICategory, IProduct } from "../../types/store";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const inStock = searchParams.get("inStock") === "true";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  useEffect(() => {
    Promise.all([api.get("/public/categories"), api.get("/public/brands")])
      .then(([categoryResponse, brandResponse]) => {
        setCategories(categoryResponse.data.data);
        setBrands(brandResponse.data.data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/public/products", {
        params: {
          page,
          limit: 12,
          search,
          category,
          brand,
          inStock
        }
      })
      .then((response) => {
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.totalPages || 1);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load products");
      })
      .finally(() => setLoading(false));
  }, [page, search, category, brand, inStock]);

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Typography variant="h4">Our Products</Typography>
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "280px 1fr" } }}>
          <Paper sx={{ p: 2, alignSelf: "start" }}>
            <Stack spacing={2}>
              <Typography variant="h6">Filters</Typography>
              <TextField
                label="Search"
                value={search}
                onChange={(event) => update("search", event.target.value)}
              />
              <TextField
                select
                label="Category"
                value={category}
                onChange={(event) => update("category", event.target.value)}
              >
                <MenuItem value="">All categories</MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Brand"
                value={brand}
                onChange={(event) => update("brand", event.target.value)}
              >
                <MenuItem value="">All brands</MenuItem>
                {brands.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inStock}
                    onChange={(event) =>
                      update("inStock", event.target.checked ? "true" : "")
                    }
                  />
                }
                label="In stock only"
              />
              <Button variant="outlined" onClick={() => setSearchParams({})}>
                Clear filters
              </Button>
            </Stack>
          </Paper>

          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={360} />
                  ))
                : products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </Box>
            {!loading && products.length === 0 && (
              <Alert severity="info">No products found.</Alert>
            )}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => update("page", String(value))}
            />
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default ProductsPage;
