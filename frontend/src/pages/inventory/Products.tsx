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

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  images: string[];
  category?: Category;
  brand?: Brand;
  retailPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  allowPreOrder: boolean;
  preOrderLimit: number;
}

const categoryForm = {
  name: "",
  description: ""
};

const brandForm = {
  name: "",
  description: "",
  logoUrl: ""
};

const productForm = {
  name: "",
  sku: "",
  description: "",
  imageUrl: "",
  category: "",
  brand: "",
  retailPrice: "",
  wholesalePrice: "",
  stockQuantity: "",
  allowPreOrder: false,
  preOrderLimit: ""
};

const Products = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] =
    useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryData, setCategoryData] =
    useState(categoryForm);
  const [brandData, setBrandData] =
    useState(brandForm);
  const [productData, setProductData] =
    useState(productForm);

  const loadCatalog = useCallback(async () => {
    const [categoryRes, brandRes, productRes] =
      await Promise.all([
        api.get("/categories"),
        api.get("/brands"),
        api.get("/products", {
          params: { search }
        })
      ]);

    setCategories(categoryRes.data.data);
    setBrands(brandRes.data.data);
    setProducts(productRes.data.data.products);
  }, [search]);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get("/categories"),
      api.get("/brands"),
      api.get("/products", {
        params: { search }
      })
    ]).then(([categoryRes, brandRes, productRes]) => {
      if (active) {
        setCategories(categoryRes.data.data);
        setBrands(brandRes.data.data);
        setProducts(productRes.data.data.products);
      }
    });

    return () => {
      active = false;
    };
  }, [search]);

  const changeCategory =
    (field: keyof typeof categoryForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setCategoryData({
        ...categoryData,
        [field]: event.target.value
      });
    };

  const changeBrand =
    (field: keyof typeof brandForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setBrandData({
        ...brandData,
        [field]: event.target.value
      });
    };

  const changeProduct =
    (field: keyof typeof productForm) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setProductData({
        ...productData,
        [field]: event.target.value
      });
    };

  const createCategory = async () => {
    await api.post("/categories", categoryData);
    setCategoryData(categoryForm);
    await loadCatalog();
  };

  const createBrand = async () => {
    await api.post("/brands", brandData);
    setBrandData(brandForm);
    await loadCatalog();
  };

  const createProduct = async () => {
    await api.post("/products", {
      ...productData,
      images: productData.imageUrl
        ? [productData.imageUrl]
        : [],
      retailPrice: Number(productData.retailPrice),
      wholesalePrice: Number(
        productData.wholesalePrice
      ),
      stockQuantity: Number(
        productData.stockQuantity
      ),
      allowPreOrder: productData.allowPreOrder,
      preOrderLimit: Number(productData.preOrderLimit || 0)
    });
    setProductData(productForm);
    await loadCatalog();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Products
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Search products"
          value={search}
          onChange={event =>
            setSearch(event.target.value)
          }
        />
        <Button
          variant="outlined"
          onClick={loadCatalog}
        >
          Search
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)"
          }
        }}
      >
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                Category
              </Typography>
              <TextField
                label="Name"
                value={categoryData.name}
                onChange={changeCategory("name")}
              />
              <TextField
                label="Description"
                value={categoryData.description}
                onChange={changeCategory(
                  "description"
                )}
              />
              <Button
                variant="contained"
                onClick={createCategory}
              >
                Create Category
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                Brand
              </Typography>
              <TextField
                label="Name"
                value={brandData.name}
                onChange={changeBrand("name")}
              />
              <TextField
                label="Description"
                value={brandData.description}
                onChange={changeBrand(
                  "description"
                )}
              />
              <TextField
                label="Logo URL"
                value={brandData.logoUrl}
                onChange={changeBrand("logoUrl")}
              />
              <Button
                variant="contained"
                onClick={createBrand}
              >
                Create Brand
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                Product
              </Typography>
              <TextField
                label="Name"
                value={productData.name}
                onChange={changeProduct("name")}
              />
              <TextField
                label="SKU"
                value={productData.sku}
                onChange={changeProduct("sku")}
              />
              <TextField
                label="Description"
                value={productData.description}
                onChange={changeProduct(
                  "description"
                )}
              />
              <TextField
                label="Image URL"
                value={productData.imageUrl}
                onChange={changeProduct("imageUrl")}
              />
              <TextField
                select
                label="Category"
                value={productData.category}
                onChange={changeProduct("category")}
              >
                {categories.map(category => (
                  <MenuItem
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Brand"
                value={productData.brand}
                onChange={changeProduct("brand")}
              >
                {brands.map(brand => (
                  <MenuItem
                    key={brand._id}
                    value={brand._id}
                  >
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Retail Price"
                type="number"
                value={productData.retailPrice}
                onChange={changeProduct(
                  "retailPrice"
                )}
              />
              <TextField
                label="Wholesale Price"
                type="number"
                value={productData.wholesalePrice}
                onChange={changeProduct(
                  "wholesalePrice"
                )}
              />
              <TextField
                label="Stock Quantity"
                type="number"
                value={productData.stockQuantity}
                onChange={changeProduct(
                  "stockQuantity"
                )}
              />
              <TextField
                select
                label="Pre-order"
                value={String(productData.allowPreOrder)}
                onChange={(event) =>
                  setProductData({
                    ...productData,
                    allowPreOrder:
                      event.target.value === "true"
                  })
                }
              >
                <MenuItem value="false">Disabled</MenuItem>
                <MenuItem value="true">Enabled</MenuItem>
              </TextField>
              <TextField
                label="Pre-order Limit"
                type="number"
                value={productData.preOrderLimit}
                onChange={changeProduct(
                  "preOrderLimit"
                )}
              />
              <Button
                variant="contained"
                onClick={createProduct}
              >
                Create Product
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2
        }}
      >
        {products.map(product => (
          <Card key={product._id}>
            <CardContent>
              <Typography variant="h6">
                {product.name}
              </Typography>
              <Typography color="text.secondary">
                SKU: {product.sku} /{" "}
                {product.category?.name} /{" "}
                {product.brand?.name}
              </Typography>
              <Typography>
                Retail: {product.retailPrice} / Wholesale:{" "}
                {product.wholesalePrice} / Stock:{" "}
                {product.stockQuantity}
              </Typography>
              <Typography>
                Pre-order: {product.allowPreOrder ? "Enabled" : "Disabled"} / Limit:{" "}
                {product.preOrderLimit || 0}
              </Typography>
              <Typography>
                {product.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default Products;
