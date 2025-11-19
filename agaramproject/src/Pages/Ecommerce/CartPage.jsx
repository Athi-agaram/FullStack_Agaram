import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import {
  getCartApi,
  updateCartItemApi,
  removeCartItemApi,
  checkoutApi,
  saveForLaterApi,
  moveToCartApi,
} from "../../api/api";

// Debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * CartPage Component
 * Props:
 *  - setTab: function to switch EcommercePage tabs
 */
export default function CartPage({ setTab }) {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  // Fetch cart on mount
  useEffect(() => {
    isMounted.current = true;
    fetchCart();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ==================== Fetch Cart ====================
  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const res = await getCartApi(user.id);
      if (isMounted.current) {
        const allItems = res.data || res;
        setItems(allItems.filter(it => !it.is_saved));
        setSavedItems(allItems.filter(it => it.is_saved));
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // ==================== Update Quantity ====================
  const debouncedQtyUpdate = useCallback(
    debounce(async (cartId, qty) => {
      try {
        await updateCartItemApi({ cartId, qty });
      } catch (err) {
        console.error(err);
      }
    }, 400),
    []
  );

  const handleQtyChange = (cartId, newQty) => {
    setItems(prev =>
      prev.map(it => (it.cart_id === cartId ? { ...it, qty: newQty } : it))
    );
    debouncedQtyUpdate(cartId, newQty);
  };

  // ==================== Remove Item ====================
  const handleRemove = async (cartId, fromSaved = false) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (!confirmDelete) return;

    if (fromSaved) {
      setSavedItems(prev => prev.filter(it => it.cart_id !== cartId));
      return;
    }

    setItems(prev => prev.filter(it => it.cart_id !== cartId));
    removeCartItemApi(cartId).catch(err => console.error(err));
  };

  // ==================== Save for Later ====================
  const handleSaveForLater = async (item) => {
    try {
      await saveForLaterApi(item.cart_id);
      setSavedItems(prev => [...prev, item]);
      setItems(prev => prev.filter(it => it.cart_id !== item.cart_id));
    } catch (err) {
      console.error(err);
      alert("Failed to save item for later");
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      await moveToCartApi(item.cart_id);
      setItems(prev => [...prev, item]);
      setSavedItems(prev => prev.filter(it => it.cart_id !== item.cart_id));
    } catch (err) {
      console.error(err);
      alert("Failed to move item to cart");
    }
  };

  // ==================== Checkout ====================
  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("Login required");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      setLoading(true);
      const res = await checkoutApi(user.id);

      if (res.data?.success) {
        alert("Order placed! Order ID: " + res.data.orderId);
        setItems([]); // clear only active items
        // Switch to Orders tab
        if (setTab) setTab(3); // 3 = Orders tab
      } else {
        alert("Checkout failed: " + res.data?.message);
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  // ==================== Render ====================
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const renderItem = (it, isSaved = false) => (
    <Paper
      key={it.cart_id}
      sx={{
        display: "flex",
        p: 2,
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        bgcolor: "#fff",
      }}
    >
      <Box sx={{ width: 120, flexShrink: 0, mr: 2 }}>
        <img
          src={it.image}
          alt={it.name}
          style={{
            width: "100%",
            height: 120,
            objectFit: "contain",
            borderRadius: 4,
            background: "#ffffffff",
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#0a66c2", cursor: "pointer", mb: 0.5 }}
          >
            {it.name}
          </Typography>
          <Rating value={it.rating || 0} precision={0.5} readOnly size="small" sx={{ mb: 0.5 }} />
          <Typography variant="body1" fontWeight="bold">
            ₹{it.price.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          {!isSaved && (
            <>
              <TextField
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                value={it.qty}
                onChange={e =>
                  handleQtyChange(it.cart_id, Math.max(1, parseInt(e.target.value || 1)))
                }
                sx={{ width: 70 }}
              />
              <Button variant="text" onClick={() => handleSaveForLater(it)} sx={{bgcolor:"#e0e7faff",fontWeight:"bold"}}>
                Save for later
              </Button>
            </>
          )}
          {isSaved && (
            <Button variant="text" onClick={() => handleMoveToCart(it)}sx={{bgcolor:"#e0e7faff",fontWeight:"bold"}}>
              Add to Cart
            </Button>
          )}
          <Button variant="text" color="error" onClick={() => handleRemove(it.cart_id, isSaved)}sx={{bgcolor:"#fae0e0ff",fontWeight:"bold"}}>
            Remove
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box>
      {items.length === 0 && savedItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>Your cart is empty.</Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          {/* Active Cart Items */}
          {items.length > 0 && (
            <>
              {items.map(it => renderItem(it))}
              <Paper
                sx={{
                  p: 3,
                  mt: 2,
                  textAlign: "right",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Subtotal ({items.length} items): ₹{total.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2,fontWeight:"bold" }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </>
          )}

          {/* Saved for Later Items */}
          {savedItems.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 ,fontWeight:"bold"}}>
                Saved for Later
              </Typography>
              {savedItems.map(it => renderItem(it, true))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
