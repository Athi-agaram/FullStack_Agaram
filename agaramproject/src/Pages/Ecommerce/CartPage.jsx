import React, { useCallback, useEffect, useState } from "react";
import { Box, Paper, Typography, Button, TextField, Rating, CircularProgress } from "@mui/material";
import { updateCartItemApi, checkoutApi, getCartApi, removeCartItemApi } from "../../api/api"; // Ensure removeCartItemApi is imported

// Simple debounce function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function CartPage({
  cartItems,
  setCartItems,
  wishlistItems,
  setWishlistItems,
  setTab,
  fetchOrders, // <-- Add fetchOrders as prop
}) {
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // For displaying errors

  // Debounced API update for quantity changes
  const debouncedQtyUpdate = useCallback(
    debounce(async (productId, qty) => {
      try {
        await updateCartItemApi({ productId, qty });
      } catch (err) {
        console.error("Failed to update cart item:", err);
      }
    }, 400),
    []
  );

  // Fetch the cart data (could be triggered on component mount or update)
  const fetchCart = async (userId) => {
    setLoading(true);
    try {
      const res = await getCartApi(userId);
      if (res.data) {
        setCartItems(res.data); // Set cart items from the response
      }
    } catch (err) {
      setError("Error fetching cart data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart data on component mount or when user ID changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      fetchCart(user.id);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Remove item from cart or wishlist
const handleRemove = async (cartId, fromWishlist = false) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return; // Ensure user is logged in

    // Remove from the cart or wishlist in state
    if (fromWishlist) {
      setWishlistItems((prev) => prev.filter((it) => it.id !== cartId));
    } else {
      setCartItems((prev) => prev.filter((it) => it.id !== cartId));
    }

    // Remove from backend (API call)
    const res = await removeCartItemApi(cartId);
    console.log("Remove item response:", res); // Check if backend returns success

    if (res.data?.success) {
      // Re-fetch cart data after removal to ensure the UI is synced with the backend
      fetchCart(user.id);
    } else {
      console.error("Failed to remove item from the backend");
    }
  } catch (err) {
    console.error("Failed to remove item from cart:", err);
  }
};


  // Save item for later
  const handleSaveForLater = (item) => {
    setWishlistItems((prev) => {
      if (!prev.find((it) => it.id === item.id)) return [...prev, item];
      return prev;
    });
    setCartItems((prev) => prev.filter((it) => it.id !== item.id));
  };

  // Move item back to cart
  const handleMoveToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === item.id);
      if (existing) {
        return prev.map((it) =>
          it.id === item.id ? { ...it, qty: it.qty + item.qty } : it
        );
      }
      return [...prev, item];
    });
    setWishlistItems((prev) => prev.filter((it) => it.id !== item.id));
  };

  // Change quantity
  const handleQtyChange = (productId, newQty) => {
    setCartItems((prev) =>
      prev.map((it) => (it.id === productId ? { ...it, qty: newQty } : it))
    );
    debouncedQtyUpdate(productId, newQty);
  };

  // Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const cartData = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      }));

      const res = await checkoutApi(user.id, cartData); // Pass the user ID and cart items to the API

      if (res.data?.success) {
        alert("Order placed successfully! Order ID: " + res.data.orderId);
        setCartItems([]); // Clear cart on success
        if (setTab) setTab(3); // Go to Orders tab
        fetchOrders(); // Reload orders after checkout
      } else {
        alert("Checkout failed: " + (res.data?.error || "Unknown error"));
      }
    } catch (err) {
      alert("Checkout failed: " + (err?.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Calculate total
  const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <Box sx={{ p: 2 }}>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      )}
      {cartItems.length === 0 && wishlistItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>Your cart is empty.</Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* CART ITEMS */}
          {cartItems.map((it) => (
            <Paper key={it.id} sx={{ display: "flex", p: 2, borderRadius: 1, border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
              <Box sx={{ width: 120, flexShrink: 0, mr: 2 }}>
                <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{it.name}</Typography>
                <Rating value={it.rating || 0} readOnly size="small" />
                <Typography variant="body1" fontWeight="bold">
                  ₹{it.price.toFixed(2)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={it.qty}
                    onChange={(e) => handleQtyChange(it.id, Math.max(1, parseInt(e.target.value || "1")))}
                    sx={{ width: 70 }}
                  />
                  <Button onClick={() => handleSaveForLater(it)}>Save for later</Button>
                  <Button color="error" onClick={() => handleRemove(it.id)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}

          {/* WISHLIST / SAVED FOR LATER */}
          {wishlistItems.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Saved for Later
              </Typography>
              {wishlistItems.map((it) => (
                <Paper key={it.id} sx={{ display: "flex", p: 2, borderRadius: 1, border: "1px solid #e0e0e0", bgcolor: "#fdfdfd", mb: 1 }}>
                  <Box sx={{ width: 120, flexShrink: 0, mr: 2 }}>
                    <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{it.name}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{it.price.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button variant="contained" onClick={() => handleMoveToCart(it)}>
                        Move to Cart
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleRemove(it.id, true)}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* CART TOTAL */}
          {cartItems.length > 0 && (
            <Paper sx={{ p: 3, mt: 2, textAlign: "right" }}>
              <Typography variant="h6" fontWeight="bold">
                Subtotal ({cartItems.reduce((sum, it) => sum + it.qty, 0)} items): ₹{total.toFixed(2)}
              </Typography>
              <Button variant="contained" onClick={handleCheckout} sx={{ mt: 2 }}>
                Proceed to Checkout
              </Button>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}
