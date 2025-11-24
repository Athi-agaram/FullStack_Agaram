import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Rating,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  updateCartItemApi,
  checkoutApi,
  getCartApi,
  removeCartItemApi,
} from "../../api/api";

// ---------------- Debounce helper ----------------
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
  savedForLater,        // ← Changed from wishlistItems
  setSavedForLater,     // ← Changed from setWishlistItems
  setTab,
  fetchOrders,
}) {
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ---------------- FETCH CART ----------------
  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await getCartApi(user.id);

      if (Array.isArray(res.data)) {
        const mapped = res.data.map((r) => ({
          id: r.cart_id,
          productId: r.product_id,
          name: r.name,
          price: Number(r.price),
          image: r.image,
          qty: Number(r.qty),
          rating: r.rating || 0,
          is_saved: r.is_saved === 1,
        }));

        const activeCart = mapped.filter((i) => !i.is_saved);
        const savedItems = mapped.filter((i) => i.is_saved);

        setCartItems(activeCart);
        setSavedForLater(savedItems);  // ← Changed
      } else {
        setCartItems([]);
        setSavedForLater([]);  // ← Changed
      }
    } catch (err) {
      console.error("Fetch cart failed:", err);
      setMessage({ type: "error", text: "Failed to load cart" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ---------------- DEBOUNCED QTY UPDATE ----------------
  const debouncedQtyUpdate = useCallback(
    debounce(async (cartId, qty) => {
      try {
        await updateCartItemApi(cartId, qty, null);
      } catch (err) {
        console.error("Qty update failed:", err);
        setMessage({ type: "error", text: "Failed to update quantity" });
      }
    }, 500),
    []
  );

  const handleQtyChange = (cartId, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartId ? { ...item, qty: newQty } : item))
    );
    debouncedQtyUpdate(cartId, newQty);
  };

  // ---------------- REMOVE ITEM ----------------
  const handleRemove = async (cartId) => {
    try {
      await removeCartItemApi(cartId);
      setCartItems((prev) => prev.filter((i) => i.id !== cartId));
      setSavedForLater((prev) => prev.filter((i) => i.id !== cartId));  // ← Changed
      setMessage({ type: "success", text: "Item removed" });
    } catch (err) {
      console.error("Remove failed:", err);
      setMessage({ type: "error", text: "Failed to remove item" });
    }
  };

  // ---------------- SAVE FOR LATER ----------------
  const handleSaveForLater = async (item) => {
    try {
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));
      setSavedForLater((prev) => [...prev, { ...item, is_saved: true }]);  // ← Changed
      setMessage({ type: "success", text: "Saved for later" });

      await updateCartItemApi(item.id, item.qty, true);
    } catch (err) {
      console.error("Save for later failed:", err);
      setMessage({ type: "error", text: "Failed to save for later" });
      fetchCart();
    }
  };

  // ---------------- MOVE TO CART ----------------
  const handleMoveToCart = async (item) => {
    try {
      setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));  // ← Changed
      setCartItems((prev) => [...prev, { ...item, is_saved: false }]);
      setMessage({ type: "success", text: "Moved to cart" });

      await updateCartItemApi(item.id, item.qty, false);
    } catch (err) {
      console.error("Move failed:", err);
      setMessage({ type: "error", text: "Failed to move to cart" });
      fetchCart();
    }
  };

  // ---------------- CHECKOUT ----------------
  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!cartItems || cartItems.length === 0) {
      setMessage({
        type: "warning",
        text: "Your cart is empty! Move items from 'Saved for Later' to proceed.",
      });
      return;
    }

    try {
      setCheckoutLoading(true);
      const res = await checkoutApi(user.id);

      if (res.data?.success) {
        setMessage({
          type: "success",
          text: `Order placed successfully! Order ID: ${res.data.orderId}`,
        });

        // Only clear active cart items
        setCartItems([]);
        
        // Keep saved-for-later items untouched
        // (no need to call setSavedForLater)

        if (fetchOrders) fetchOrders();
        setTimeout(() => setTab && setTab(3), 1500);
      } else {
        setMessage({ type: "error", text: res.data?.error || "Checkout failed" });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Checkout failed. Please try again.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 2 ,bgcolor:"#e1e7f3ff", minHeight: "100%"}}>
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      )}

      {/* Active Cart */}
      {!loading && cartItems.length > 0 && (
        <Box>

          {cartItems.map((it) => (
            <Paper key={it.id} sx={{ display: "flex", p: 2, mb: 1.2, border: "1px solid #ddd",borderRadius:3 }}>
              <Box sx={{ width: 120, mr: 2 }}>
                <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>{it.name}</Typography>
                <Rating value={it.rating} readOnly size="small" />
                <Typography fontWeight="bold" mt={1} color="primary">₹{it.price.toFixed(2)}</Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">Qty:</Typography>
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 1, max: 99 }}
                      sx={{ width: 70 }}
                      value={it.qty}
                      onChange={(e) =>
                        handleQtyChange(it.id, Math.max(1, Math.min(99, parseInt(e.target.value || "1"))))
                      }
                    />
                  </Box>
                  <Button variant="outlined" size="small" onClick={() => handleSaveForLater(it)}>
                    Save for Later
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleRemove(it.id)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Saved for Later */}
      {!loading && savedForLater.length > 0 && (  // ← Changed
        <Box mt={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? "item" : "items"})  {/* ← Changed */}
          </Typography>

          {savedForLater.map((it) => (  // ← Changed
            <Paper key={it.id} sx={{ display: "flex", p: 2, mb: 2, border: "1px solid #ddd", background: "#fafafa" }}>
              <Box sx={{ width: 120, mr: 2 }}>
                <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>{it.name}</Typography>
                <Typography fontWeight="bold" mt={1}>₹{it.price.toFixed(2)}</Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                  <Button variant="contained" size="small" onClick={() => handleMoveToCart(it)}>
                    Move to Cart
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleRemove(it.id)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Total & Checkout */}
      {cartItems.length > 0 && (
        <Paper sx={{ p: 1, mt: 2, textAlign: "right", position: "sticky", bottom: 0 ,bgcolor: "#eeeff1ff",borderColor:"#cccccc", borderWidth:1, borderStyle:"solid"}}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Subtotal ({cartItems.reduce((s, it) => s + it.qty, 0)} items):
            <span style={{ color: "#1976d2", marginLeft: 8 }}>₹{total.toFixed(2)}</span>
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleCheckout}
            disabled={checkoutLoading}
            sx={{ mt: 2, minWidth: 200 }}
          >
            {checkoutLoading ? <CircularProgress size={24} color="inherit" /> : "Proceed to Checkout"}
          </Button>
        </Paper>
      )}

      {/* Info when cart empty but savedForLater has items */}
      {!loading && cartItems.length === 0 && savedForLater.length > 0 && (  // ← Changed
        <Paper sx={{ p: 3, mt: 2, bgcolor: "#fff3cd", border: "1px solid #ffc107" }}>
          <Typography variant="body1" color="text.primary">
            💡 Your shopping cart is empty. Move items from "Saved for Later" to your cart to proceed with checkout.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}