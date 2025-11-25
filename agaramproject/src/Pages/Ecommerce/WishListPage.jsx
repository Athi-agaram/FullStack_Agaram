import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid } from "@mui/material";
import { addToCartApi, removeWishlistApi } from "../../api/api";

export default function WishlistPage({ 
  userId, 
  wishlistItems, 
  setWishlistItems,
  cartItems,
  setCartItems 
}) {
  const handleRemove = async (wishlistId) => {
    try {
      await removeWishlistApi(userId, wishlistId);
      setWishlistItems(prev => prev.filter(item => item.wishlist_id !== wishlistId));
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      alert("Error removing item from wishlist");
    }
  };

  const handleAddToCart = async (item) => {
    try {
      if (!userId) {
        alert("Please login");
        return;
      }

      await addToCartApi({ userId, productId: item.id, qty: 1 });
      
      // Update cart state
      setCartItems(prev => {
        const existing = prev.find(x => x.product_id === item.id);
        if (existing) {
          return prev.map(x => x.product_id === item.id ? { ...x, qty: x.qty + 1 } : x);
        } else {
          return [...prev, { product_id: item.id, qty: 1 }];
        }
      });
      
      // Remove from wishlist after adding to cart
      await handleRemove(item.wishlist_id);
      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding to cart");
    }
  };

  if (!wishlistItems.length) {
    return (
      <Typography sx={{ p: 4, textAlign: "center", color: "#777", fontSize: 18 }}>
        Your wishlist is empty. Start adding items you love!
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 },background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
 minHeight: "100%" }}>

      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.wishlist_id}>
            <Card sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              p: 2, 
              height: "370px",
              width: "267px",
              borderRadius: 3, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
              transition: "transform 0.2s", 
              "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" } 
            }}>
              <CardMedia 
                component="img" 
                image={item.image || "https://via.placeholder.com/120"} 
                alt={item.product_name || item.name} 
                sx={{ width: "100%", height: 160, objectFit: "contain", borderRadius: 2, bgcolor: "#fff", mb: 2 }} 
              />
              <CardContent sx={{ flex: 1, p: 0, width: "100%", textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {item.product_name || item.name}
                </Typography>
                <Typography variant="subtitle1" color="green" fontWeight={600} mt={0.5}>
                  ₹{item.product_price || item.price}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={() => handleAddToCart(item)} 
                    sx={{ 
                      textTransform: "none", 
                      fontWeight: 600,
                      height: 40,
                      borderRadius: 2
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    fullWidth 
                    onClick={() => handleRemove(item.wishlist_id)} 
                    sx={{ 
                      textTransform: "none", 
                      fontWeight: 600,
                      height: 40,
                      borderRadius: 2
                    }}
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