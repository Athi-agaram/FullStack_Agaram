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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addToCartApi, addWishlistApi, removeWishlistApi } from "../../../api/api";
import productsData from "./products.json";

const mapCategory = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("electronics")) return "electronics";
  if (c.includes("fashion")) return "fashion";
  if (c.includes("shoe")) return "shoes";
  if (c.includes("beauty") || c.includes("skincare")) return "Beauty and skincare";
  if (c.includes("home") || c.includes("kitchen")) return "home and furniture";
  if (c.includes("health") || c.includes("fitness")) return "Health and Fitness";
  return c.trim();
};

export default function ProductGrid({
  initialProducts = [],
  cartItems,
  setCartItems,
  wishlistItems,
  setWishlistItems,
  userId,
}) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState("none");

  const normalizeProducts = (arr) =>
    arr.map((p) => ({
      id: Number(p.id),
      name: p.name,
      image: p.image,
      price: p.price || (p.priceCents ? p.priceCents / 100 : 0),
      brand: p.brand || p.subCategory || p.category || "N/A",
      category: mapCategory(p.category),
      keywords: p.keywords || [],
      rating: p.rating?.stars !== undefined ? Number(p.rating.stars) : Math.floor(Math.random() * 5) + 1,
      reviews: p.rating?.count !== undefined ? Number(p.rating.count) : Math.floor(Math.random() * 200) + 1,
    }));

  // Load products
  useEffect(() => {
    setLoading(true);
    const list =
      initialProducts.length > 0
        ? normalizeProducts(initialProducts)
        : normalizeProducts(productsData);
    setProducts(list);
    setFiltered(list);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [initialProducts]);

  const categoryList = ["all", ...new Set(products.map((p) => p.category))];

  // Filtering / sorting
  useEffect(() => {
    let list = [...products];
    const s = search.toLowerCase();

    if (s.trim() !== "") {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.keywords.some((k) => k.toLowerCase().includes(s))
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortType === "low-high") list.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
  }, [search, selectedCategory, sortType, products]);

  // Toggle wishlist (synced with backend)
  const toggleWishlist = async (product) => {
    try {
      if (!userId) {
        alert("Please login");
        return;
      }

      const existing = wishlistItems.find((x) => x.id === product.id);
      
      if (existing) {
        // Remove from wishlist
        await removeWishlistApi(userId, existing.wishlist_id);
        setWishlistItems(wishlistItems.filter((x) => x.id !== product.id));
      } else {
        // Add to wishlist
        const res = await addWishlistApi(userId, product.id, 1);
        const newWishlistItem = {
          id: product.id,
          wishlist_id: res.data?.id,
          name: product.name,
          product_name: product.name,
          image: product.image,
          price: product.price,
          product_price: product.price,
        };
        setWishlistItems([...wishlistItems, newWishlistItem]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      alert("Error updating wishlist");
    }
  };

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      if (!userId) {
        alert("Please login");
        return;
      }

      await addToCartApi({ userId, productId: product.id, qty: 1 });

      // Fetch updated cart
      const updatedCartRes = await fetch(`http://localhost:8098/api/cart/${userId}`);
      const updatedCart = await updatedCartRes.json();
      setCartItems(updatedCart);

      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding to cart");
    }
  };

  return (
    <Box sx={{ height: "100%", overflow: "visible" ,bgcolor:"#e1e7f3ff"}}>
      {/* FILTER BAR */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          position: "sticky",
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "#e1e7f3ff",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: "#fff",
              height: 50,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#777" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ width: 200, bgcolor: "#fff" }}
        >
          {categoryList.map((c) => (
            <MenuItem key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          sx={{ width: 200, bgcolor: "#fff" }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="low-high">Price: Low → High</MenuItem>
          <MenuItem value="high-low">Price: High → Low</MenuItem>
        </TextField>
      </Paper>

      {/* PRODUCT GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 1,
          margin: 1,
          bgcolor: "#e1e7f3ff",
        }}
      >
        {loading
          ? Array.from(new Array(8)).map((_, i) => (
              <Card key={i} sx={{ borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" height={28} width="70%" />
                  <Skeleton variant="text" height={24} width="40%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="rectangular" height={36} width="100%" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            ))
          : filtered.map((p) => (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0px 3px 8px rgba(0,0,0,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 24px rgba(0,0,0,0.18)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={p.image}
                  alt={p.name}
                  sx={{ height: 150, objectFit: "contain", bgcolor: "#fdfdfd",pt:2 }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography fontWeight="bold" noWrap>
                    {p.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    <Rating
                      name={`rating-${p.id}`}
                      value={p.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({p.reviews})
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "green", fontWeight: 600, mt: 0.5 }}>
                    ₹{p.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {p.brand}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                    <Button
                      variant="outlined"
                      sx={{ minWidth: 50, width: 50, height: 50, p: 0, borderRadius: 2,border:"none" }}
                      onClick={() => toggleWishlist(p)}
                    >
                      {wishlistItems.find((x) => x.id === p.id) ? (
                        <FavoriteIcon sx={{ fontSize: 35, color: "blue" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 35 }} />
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        flex: 1,
                        height: 45,
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: 16,
                        textTransform: "none",
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#1565c0" },
                      }}
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
      </Box>
    </Box>
  );
}