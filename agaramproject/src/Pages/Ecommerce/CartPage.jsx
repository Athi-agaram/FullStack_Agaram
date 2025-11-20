import React, { useCallback } from "react";
import { Box, Paper, Typography, Button, TextField, Rating } from "@mui/material";
import { updateCartItemApi, checkoutApi } from "../../api/api";

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
  setTab
}) {
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

  // Remove item
  const handleRemove = (cartId, fromSaved = false) => {
    if (fromSaved) {
      setWishlistItems(prev => prev.filter(it => it.cart_id !== cartId));
    } else {
      setCartItems(prev => prev.filter(it => it.cart_id !== cartId));
    }
  };

  // Save for later
// Save for later
const handleSaveForLater = (item) => {
  // Add to wishlist only if not already there
  setWishlistItems(prevWishlist => {
    if (!prevWishlist.find(it => it.cart_id === item.cart_id)) {
      return [...prevWishlist, item];
    }
    return prevWishlist;
  });

  // Remove only this item from cart
  setCartItems(prevCart => prevCart.filter(it => it.cart_id !== item.cart_id));
};


  // Move back to cart
  const handleMoveToCart = (item) => {
    setCartItems(prevCart => {
      if (!prevCart.find(it => it.cart_id === item.cart_id)) {
        return [...prevCart, item];
      }
      return prevCart;
    });
    setWishlistItems(prevWishlist => prevWishlist.filter(it => it.cart_id !== item.cart_id));
  };

  // Update quantity
  const handleQtyChange = (cartId, newQty) => {
    setCartItems(prev =>
      prev.map(it => (it.cart_id === cartId ? { ...it, qty: newQty } : it))
    );
    debouncedQtyUpdate(cartId, newQty);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    try {
      const res = await checkoutApi(1); // Example user id
      if (res.data?.success) {
        alert("Order placed! Order ID: " + res.data.orderId);
        setCartItems([]);
        if (setTab) setTab(3);
      } else {
        alert("Checkout failed: " + res.data?.message);
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <Box sx={{ p: 2 }}>
      {cartItems.length === 0 && wishlistItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>Your cart is empty.</Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Cart Items */}
          {cartItems.map((it) => (
            <Paper key={it.cart_id} sx={{ display: "flex", p: 2, borderRadius: 1, border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
              <Box sx={{ width: 120, flexShrink: 0, mr: 2 }}>
                <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{it.name}</Typography>
                <Rating value={it.rating || 0} readOnly size="small" />
                <Typography variant="body1" fontWeight="bold">₹{it.price.toFixed(2)}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={it.qty}
                    onChange={(e) => handleQtyChange(it.cart_id, Math.max(1, parseInt(e.target.value || "1")))}
                    sx={{ width: 70 }}
                  />
                  <Button onClick={() => handleSaveForLater(it)}>Save for later</Button>
                  <Button color="error" onClick={() => handleRemove(it.cart_id)}>Remove</Button>
                </Box>
              </Box>
            </Paper>
          ))}

          {/* Wishlist / Saved Items */}
          {wishlistItems.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>Saved for Later</Typography>
              {wishlistItems.map((it) => (
                <Paper key={it.cart_id} sx={{ display: "flex", p: 2, borderRadius: 1, border: "1px solid #e0e0e0", bgcolor: "#fdfdfd", mb: 1 }}>
                  <Box sx={{ width: 120, flexShrink: 0, mr: 2 }}>
                    <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{it.name}</Typography>
                    <Typography variant="body1" fontWeight="bold">₹{it.price.toFixed(2)}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button variant="contained" onClick={() => handleMoveToCart(it)}>Move to Cart</Button>
                      <Button variant="outlined" color="error" onClick={() => handleRemove(it.cart_id, true)}>Remove</Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Subtotal */}
          {cartItems.length > 0 && (
            <Paper sx={{ p: 3, mt: 2, textAlign: "right" }}>
              <Typography variant="h6" fontWeight="bold">
                Subtotal ({cartItems.length} items): ₹{total.toFixed(2)}
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
