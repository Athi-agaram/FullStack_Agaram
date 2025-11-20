import React, { useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, Stack } from "@mui/material";

export default function WishlistPage({
  wishlistItems,
  setWishlistItems,
  setWishlistCount,
  setCartCount
}) {

  // Sync wishlist count on mount
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(items);
    setWishlistCount(items.length);
  }, []);

  const handleRemove = (id) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlistItems(updated);
    setWishlistCount(updated.length);
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.find((x) => x.id === item.id)) {
      cart.push({ ...item, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartCount(cart.length);
      alert("Added to cart!");
    }
  };

  if (!wishlistItems || wishlistItems.length === 0)
    return <Typography sx={{ p: 4, textAlign: "center", color: "#777" }}>Your wishlist is empty.</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9fafc", minHeight: "100%" }}>
      <Stack spacing={3}>
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              p: 2,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
            }}
          >
            <CardMedia
              component="img"
              image={item.image || "https://via.placeholder.com/120"}
              alt={item.name}
              sx={{
                width: { xs: "100%", sm: 120 },
                height: 120,
                objectFit: "contain",
                borderRadius: 2,
                bgcolor: "#f5f5f5",
                mr: { sm: 3 },
                mb: { xs: 2, sm: 0 },
              }}
            />
            <CardContent sx={{ flex: 1, p: 0 }}>
              <Typography variant="h6" fontWeight="bold">
                {item.name}
              </Typography>
              <Typography variant="subtitle1" color="green" fontWeight={600} mt={0.5}>
                ₹{item.price}
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(item)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemove(item.id)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Remove
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
