import React, { useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid } from "@mui/material";

export default function WishlistPage({
  wishlistItems,
  setWishlistItems,
  cartItems,
  setCartItems
}) {

  // Sync wishlist from localStorage on mount
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(items);
  }, []);

  const handleRemove = (id) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlistItems(updated);
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((x) => x.id === item.id);
    if (existing) {
      cart.forEach(x => x.id === item.id && (x.qty += 1));
    } else {
      cart.push({ ...item, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart); 
    alert("Added to cart!");
  };

  if (!wishlistItems || wishlistItems.length === 0)
    return <Typography sx={{ p: 4, textAlign: "center", color: "#777" }}>Your wishlist is empty.</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9fafc", minHeight: "100%" }}>
      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
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
                  width: "100%",
                  height: 160,
                  objectFit: "contain",
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 1)",
                  mb: 2
                }}
              />
              <CardContent sx={{ flex: 1, p: 0, width: "100%" }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" color="green" fontWeight={600} mt={0.5}>
                  ₹{item.price}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(item)}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleRemove(item.id)}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Remove
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
