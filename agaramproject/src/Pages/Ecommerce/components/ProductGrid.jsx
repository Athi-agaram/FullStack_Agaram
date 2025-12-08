import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Skeleton,
  Rating,
  Modal,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import {
  addToCartApi,
  addWishlistApi,
  removeWishlistApi,
  addStoreProduct,
} from "../../../api/api";

const categoryOptions = [
  { id: 1, key: "electronics", name: "Electronics & Gadgets" },
  { id: 2, key: "beauty", name: "Beauty & Personal Care" },
  { id: 3, key: "fashion", name: "Fashion & Apparel" },
  { id: 4, key: "home", name: "Home & Kitchen" },
  { id: 5, key: "health", name: "Health & Fitness" },
  { id: 6, key: "shoes", name: "Shoes" },
];

export default function ProductGrid({
  cartItems,
  setCartItems,
  wishlistItems,
  setWishlistItems,
  userId,
  userRole,
  selectedCategoryFromCategoryPage,
}) {
  // --- data states
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);


  // --- UI states
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sortType, setSortType] = useState("none");

  // --- modal / new product
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category_id: 1,
    subcategory: "",
    image: "",
    rating_stars: 4.5,
    rating_count: 10,
    description: "",
    keywords: "",
    stock: 0,
  });

  // --- normalize backend product shape to predictable fields
  const normalizeProducts = (arr) =>
    arr.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price || 0),
      category: p.category || "",
      image: p.image || "",
      rating: Number(p.rating_stars ?? p.rating ?? 4) || 4,
      reviews: Number(p.rating_count ?? p.reviews ?? 0) || 0,
      keywords:
        typeof p.keywords === "string"
          ? p.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : Array.isArray(p.keywords)
          ? p.keywords
          : [],
      stock: Number(p.stock ?? 0) || 0,
      category_id: Number(p.category_id ?? 1) || 1,
    }));

  // --- fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://192.168.0.224:8098/api/storeproducts");
      const data = await res.json();
      const list = normalizeProducts(data);
      setProducts(list);
      setFiltered(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- honor selectedCategoryFromCategoryPage if provided (number or string)
  useEffect(() => {
    if (
      selectedCategoryFromCategoryPage !== undefined &&
      selectedCategoryFromCategoryPage !== null &&
      selectedCategoryFromCategoryPage !== ""
    ) {
      const parsed = Number(selectedCategoryFromCategoryPage);
      if (!Number.isNaN(parsed) && parsed > 0) setSelectedCategoryId(parsed);
      // if caller passed a key or name instead of id, you could map it here.
    }
  }, [selectedCategoryFromCategoryPage]);

  // --- filtering / searching / sorting
  useEffect(() => {
    let list = [...products];

    // search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.keywords.some((k) => k.toLowerCase().includes(s))
      );
    }

    // category filter (0 = all)
    if (selectedCategoryId && Number(selectedCategoryId) !== 0) {
      list = list.filter((p) => Number(p.category_id) === Number(selectedCategoryId));
    }

    // sort
    if (sortType === "low-high") list.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
  }, [search, selectedCategoryId, sortType, products]);

  // --- wishlist toggle
  const toggleWishlist = async (p) => {
    if (!userId) return alert("Login required");

    const exists = wishlistItems.find((x) => x.id === p.id);

    try {
      if (exists) {
        await removeWishlistApi(userId, exists.wishlist_id);
        setWishlistItems(wishlistItems.filter((x) => x.id !== p.id));
      } else {
        const res = await addWishlistApi(userId, p.id, 1);
        setWishlistItems([
          ...wishlistItems,
          {
            id: p.id,
            wishlist_id: res.data?.id,
            name: p.name,
            price: p.price,
            image: p.image,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      alert("Wishlist action failed");
    }
  };

  // --- add to cart
const BASE_URL = `http://${window.location.hostname}:8098/api`;

const handleAddToCart = async (product) => {
  try {
    if (!userId) return alert("Login required");

    await addToCartApi({ userId, productId: product.id, qty: 1 });

    const updated = await fetch(`${BASE_URL}/cart/${userId}`).then((res) => res.json());

    setCartItems(updated);

    alert("Added to cart!");
  } catch (err) {
    console.error(err);
    alert("Failed adding to cart");
  }
};


  // --- save new product (admin)
  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category_id) {
      return alert("Please fill Name, Price, Image URL, and Category");
    }

    try {
      const payload = {
        name: newProduct.name,
        price: Number(newProduct.price),
        category: categoryOptions.find((c) => c.id === Number(newProduct.category_id))?.name || "",
        subcategory: newProduct.subcategory || "",
        image: newProduct.image,
        ratingStars: Number(newProduct.rating_stars),
        ratingCount: Number(newProduct.rating_count),
        description: newProduct.description || "",
        keywords: newProduct.keywords || "",
        stock: Number(newProduct.stock || 0),
        category_id: Number(newProduct.category_id),
      };

      const res = await addStoreProduct(payload);

      // some api wrappers return { ok: true } others return axios-like objects. handle both:
      const ok = res?.ok ?? (res?.status && res.status >= 200 && res.status < 300);

      if (!ok) throw new Error("Backend error");

      alert("Product added!");
      fetchProducts();
      setOpenModal(false);
      setNewProduct({
        name: "",
        price: 0,
        category_id: 1,
        subcategory: "",
        image: "",
        rating_stars: 4.5,
        rating_count: 10,
        description: "",
        keywords: "",
        stock: 0,
      });
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product: " + (err.message || err));
    }
  };

  const categoryListForDropdown = [{ id: 0, name: "All" }, ...categoryOptions];

  const filterPaperSx = {
    p: 1.3,
    position: "sticky",
    top: 0,
    zIndex: 10,
    mt: 0,
    mb: 3,
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    alignItems: "center",
    bgcolor: "rgba(255, 255, 255, 0.83)",
    backdropFilter: "blur(8px)",
    borderRadius: 3,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
        Height: "100vh",
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* FILTER BAR */}
      <Paper elevation={0} sx={filterPaperSx}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 300 },
            height: 50,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              backgroundColor: "#f8f9fa",
              height: 48,
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              },
              "&.Mui-focused": {
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.12)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#001574ff" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
        sx={{ 
          width: 160,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f8f9fa"
          },
          "& .MuiInputLabel-shrink": {
            color: "#001058ff !important",
            fontWeight: 600,
            fontSize:"20px",
            bgcolor: "rgba(236, 231, 255, 1)",
            borderRadius: "5px !important",
            padding:"1px 4px",
          }
        }}
        >
          {categoryListForDropdown.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

       <TextField
        select
        label="Sort"
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        sx={{ 
          width: 160,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f8f9fa"
          },
          "& .MuiInputLabel-shrink": {
            color: "#001058ff !important",
            fontWeight: 600,
            fontSize:"20px",
            bgcolor: "rgba(236, 231, 255, 1)",
            borderRadius: "5px !important",
            padding:"1px 4px",
          }
        }}
      >
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="low-high">Low to High</MenuItem>
        <MenuItem value="high-low">High to Low</MenuItem>
      </TextField>

        {userRole === "ADMIN" && (
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              fontWeight: 700,
              bgcolor: "#05155aff",
              height: 48,
              px: 4,
              borderRadius: 50,
              alignSelf: "center",
              width: "300px",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              "&:hover": {
                bgcolor: "#2f3f9bff",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.45)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.25s ease",
              ml: 1
            }}
          >
            + Add Product
          </Button>
        )}
      </Paper>

      {/* PRODUCT GRID */}
<Box
  sx={{
    display: "grid",
    gap: 3,
    gridTemplateColumns: {
     xs: "repeat(1, 1fr)", // phones → 1 product per row
     sm: "repeat(2, 1fr)", // small tablets → 2 per row
     md: "repeat(3, 1fr)", // tablets → 3 per row
     lg: "repeat(4, 1fr)", // desktops → 4 per row
     xl: "repeat(5, 1fr)", // wide → 5 per row
},

  }}
>
        {loading
          ? Array.from(new Array(8)).map((_, i) => (
              <Card key={i} sx={{ borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton height={28} width="70%" />
                  <Skeleton height={20} width="40%" />
                </CardContent>
              </Card>
            ))
          : filtered.map((p) => (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                    "& .product-image": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    height: { xs: 140, sm: 160, md: 180 },
                    overflow: "hidden",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={p.image}
                    className="product-image"
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease",
                    }}
                    alt={p.name}
                  />
                </Box>

                <CardContent sx={{ textAlign: "center", p: 2.5, bgcolor: "#f8f9fa" }}>
                  <Typography
                    fontWeight={700}
                    sx={{
                      mb: -1,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      lineHeight: 1.2,
                      minHeight: 44,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.name}
                  </Typography>

                  <Rating value={p.rating} readOnly size="small" sx={{ mt:-5 }} />

                  <Typography
                    sx={{
                      color: "#006928ff",
                      fontSize: "22px",
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    ₹{p.price}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        minWidth: { xs: 40, sm: 50 },
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        p: 0,
                        borderRadius: 2,
                        border: "0px ",
                      }}
                      onClick={() => toggleWishlist(p)}
                    >
                      {wishlistItems.find((x) => x.id === p.id) ? (
                        <FavoriteIcon sx={{ fontSize: 30, color: "#f13737ff" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 36, color: "#9ca3af" }} />
                      )}
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(p)}
                        sx={{
                          fontWeight: 700,
                          height: { xs: 40, md: 45 },
                        backgroundColor: "#000d46ff",
                        color: "#fff",
                        "&:hover": {
                        backgroundColor: "#003570ff"
                        },
                       }}
                     
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
      </Box>

      {/* ADD PRODUCT MODAL (ADMIN) */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            width: { xs: "92%", sm: 520 },
            background: "white",
            p: 3,
            borderRadius: 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Product
          </Typography>

          <TextField
            fullWidth
            label="Product Name"
            sx={{ mt: 1 }}
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            sx={{ mt: 2 }}
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />

          <TextField
            fullWidth
            select
            label="Category"
            sx={{ mt: 2 }}
            value={newProduct.category_id}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category_id: Number(e.target.value) })
            }
          >
            {categoryOptions.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Rating Stars"
            type="number"
            sx={{ mt: 2 }}
            inputProps={{ step: "0.1", min: 0, max: 5 }}
            value={newProduct.rating_stars}
            onChange={(e) =>
              setNewProduct({ ...newProduct, rating_stars: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Rating Count"
            type="number"
            sx={{ mt: 2 }}
            value={newProduct.rating_count}
            onChange={(e) =>
              setNewProduct({ ...newProduct, rating_count: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Image URL"
            placeholder="http://localhost:8098/product-images/201.jpg"
            sx={{ mt: 2 }}
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />

          <TextField
            fullWidth
            label="Stock"
            type="number"
            sx={{ mt: 2 }}
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />

          <TextField
            fullWidth
            label="Keywords (comma separated)"
            sx={{ mt: 2 }}
            value={newProduct.keywords}
            onChange={(e) => setNewProduct({ ...newProduct, keywords: e.target.value })}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            sx={{ mt: 2 }}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />

          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSaveProduct}>
            Save Product
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}