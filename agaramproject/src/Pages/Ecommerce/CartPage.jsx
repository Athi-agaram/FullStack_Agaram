// // import React, { useCallback, useEffect, useState } from "react";
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Button,
// //   TextField,
// //   Rating,
// //   CircularProgress,
// //   Alert,
// //   Divider,
// // } from "@mui/material";

// // import {
// //   updateCartItemApi,
// //   checkoutApi,
// //   getCartApi,
// //   removeCartItemApi,
// // } from "../../api/api";

// // function debounce(fn, delay) {
// //   let timer;
// //   return (...args) => {
// //     clearTimeout(timer);
// //     timer = setTimeout(() => fn(...args), delay);
// //   };
// // }

// // export default function CartPage({
// //   cartItems,
// //   setCartItems,
// //   savedForLater,
// //   setSavedForLater,
// //   setTab,
// //   fetchOrders,
// // }) {
// //   const [loading, setLoading] = useState(false);
// //   const [checkoutLoading, setCheckoutLoading] = useState(false);
// //   const [message, setMessage] = useState(null);

// //   // ---------------- FETCH CART ----------------
// //   const fetchCart = async () => {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     if (!user?.id) return;

// //     setLoading(true);
// //     try {
// //       const res = await getCartApi(user.id);
// //       console.log("Raw cart data from backend:", res.data);

// //       if (Array.isArray(res.data)) {
// //         const mapped = res.data.map((r) => {
// //           // Handle different formats of is_saved (number, boolean, string)
// //           const isSaved = r.is_saved === 1 || r.is_saved === true || r.is_saved === "1";
          
// //           console.log(`Item ${r.cart_id}: is_saved raw = ${r.is_saved}, parsed = ${isSaved}`);
          
// //           return {
// //             id: r.cart_id,
// //             productId: r.product_id,
// //             name: r.name,
// //             price: Number(r.price),
// //             image: r.image,
// //             qty: Number(r.qty),
// //             rating: r.rating || 0,
// //             is_saved: isSaved,
// //           };
// //         });

// //         const activeCart = mapped.filter((i) => !i.is_saved);
// //         const savedItems = mapped.filter((i) => i.is_saved);

// //         console.log("Active cart items:", activeCart.length);
// //         console.log("Saved for later items:", savedItems.length);

// //         setCartItems(activeCart);
// //         setSavedForLater(savedItems);
// //       } else {
// //         setCartItems([]);
// //         setSavedForLater([]);
// //       }
// //     } catch (err) {
// //       console.error("Fetch cart failed:", err);
// //       setMessage({ type: "error", text: "Failed to load cart" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCart();
// //   }, []);

// //   // ---------------- DEBOUNCED QTY UPDATE ----------------
// //   const debouncedQtyUpdate = useCallback(
// //     debounce(async (cartId, qty) => {
// //       try {
// //         await updateCartItemApi(cartId, qty, null);
// //       } catch (err) {
// //         console.error("Qty update failed:", err);
// //         setMessage({ type: "error", text: "Failed to update quantity" });
// //       }
// //     }, 500),
// //     []
// //   );

// //   const handleQtyChange = (cartId, newQty) => {
// //     setCartItems((prev) =>
// //       prev.map((item) => (item.id === cartId ? { ...item, qty: newQty } : item))
// //     );
// //     debouncedQtyUpdate(cartId, newQty);
// //   };

// //   // ---------------- REMOVE ITEM ----------------
// // const handleRemove = async (cartId) => {
// //   // Ask for confirmation
// //   const confirmDelete = window.confirm("Are you sure you want to remove this item from your cart?");
// //   if (!confirmDelete) return; // Exit if user cancels

// //   try {
// //     await removeCartItemApi(cartId);
// //     setCartItems((prev) => prev.filter((i) => i.id !== cartId));
// //     setSavedForLater((prev) => prev.filter((i) => i.id !== cartId));
// //     setMessage({ type: "success", text: "Item removed" });
// //   } catch (err) {
// //     console.error("Remove failed:", err);
// //     setMessage({ type: "error", text: "Failed to remove item" });
// //   }
// // };

// //   // ---------------- SAVE FOR LATER ----------------
// //   const handleSaveForLater = async (item) => {
// //     try {
// //       // First update the backend
// //       await updateCartItemApi(item.id, item.qty, true);
      
// //       // Then update the UI
// //       setCartItems((prev) => prev.filter((i) => i.id !== item.id));
// //       setSavedForLater((prev) => [...prev, { ...item, is_saved: true }]);
// //       setMessage({ type: "success", text: "Saved for later" });
// //     } catch (err) {
// //       console.error("Save for later failed:", err);
// //       setMessage({ type: "error", text: "Failed to save for later" });
// //       // Refresh cart to sync with backend state
// //       fetchCart();
// //     }
// //   };

// //   // ---------------- MOVE TO CART ----------------
// //   const handleMoveToCart = async (item) => {
// //     try {
// //       // First update the backend
// //       await updateCartItemApi(item.id, item.qty, false);
      
// //       // Then update the UI
// //       setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
// //       setCartItems((prev) => [...prev, { ...item, is_saved: false }]);
// //       setMessage({ type: "success", text: "Moved to cart" });
// //     } catch (err) {
// //       console.error("Move failed:", err);
// //       setMessage({ type: "error", text: "Failed to move to cart" });
// //       // Refresh cart to sync with backend state
// //       fetchCart();
// //     }
// //   };

// //   // ---------------- CHECKOUT ----------------
// //   const handleCheckout = async () => {
// //     const user = JSON.parse(localStorage.getItem("user"));

// //     if (!cartItems || cartItems.length === 0) {
// //       setMessage({
// //         type: "warning",
// //         text: "Your cart is empty! Move items from 'Saved for Later' to proceed.",
// //       });
// //       return;
// //     }

// //     try {
// //       setCheckoutLoading(true);
// //       const res = await checkoutApi(user.id);

// //       if (res.data?.success) {
// //         setMessage({
// //           type: "success",
// //           text: `Order placed successfully! Order ID: ${res.data.orderId}`,
// //         });

// //         // Only clear active cart items
// //         setCartItems([]);
        
// //         // Keep saved-for-later items untouched
// //         // (no need to call setSavedForLater)

// //         if (fetchOrders) fetchOrders();
// //         setTimeout(() => setTab && setTab(3), 1500);
// //       } else {
// //         setMessage({ type: "error", text: res.data?.error || "Checkout failed" });
// //       }
// //     } catch (err) {
// //       console.error("Checkout error:", err);
// //       setMessage({
// //         type: "error",
// //         text: err.response?.data?.error || "Checkout failed. Please try again.",
// //       });
// //     } finally {
// //       setCheckoutLoading(false);
// //     }
// //   };

// //   const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);

// //   // ---------------- UI ----------------
// //   return (
// //     <Box sx={{ 
// //       p: 3, 
// //       background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)", 
// //       minHeight: "100%" 
// //     }}>
// //       {message && (
// //         <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
// //           {message.text}
// //         </Alert>
// //       )}

// //       {loading && (
// //         <Box display="flex" justifyContent="center" py={10}>
// //           <CircularProgress />
// //         </Box>
// //       )}

// //       {/* Active Cart */}
// //       {!loading && cartItems.length > 0 && (
// //         <Box>
// //           <Typography variant="h5" color="#e8f4f8ff" fontWeight="bold" mb={2}>
// //             Cart Items ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
// //           </Typography>

// //           {cartItems.map((it) => (
// //             <Paper key={it.id} sx={{ 
// //               display: "flex", 
// //               p: 2, 
// //               mb: 1.2, 
// //               border: "1px solid #ddd",
// //               borderRadius: 3,
// //               bgcolor: "#f7f9fcff" 
// //             }}>
// //               <Box sx={{ width: 120, mr: 2 }}>
// //                 <img 
// //                   src={it.image} 
// //                   alt={it.name} 
// //                   style={{ width: "100%", height: 120, objectFit: "contain" }} 
// //                 />
// //               </Box>
// //               <Box sx={{ flex: 1 }}>
// //                 <Typography variant="subtitle1" fontWeight={600}>{it.name}</Typography>
// //                 <Rating value={it.rating} readOnly size="small" />
// //                 <Typography fontWeight="bold" mt={1} color="#035700ff">
// //                   ₹{it.price.toFixed(2)}
// //                 </Typography>
// //                 <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
// //                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                     <Typography variant="body2">Qty:</Typography>
// //                     <TextField
// //                       size="small"
// //                       type="number"
// //                       inputProps={{ min: 1, max: 99 }}
// //                       sx={{ width: 70 }}
// //                       value={it.qty}
// //                       onChange={(e) =>
// //                         handleQtyChange(it.id, Math.max(1, Math.min(99, parseInt(e.target.value || "1"))))
// //                       }
// //                     />
// //                   </Box>
// //                   <Button 
// //                     variant="contained" 
// //                     color="success" 
// //                     size="medium" 
// //                     onClick={() => handleSaveForLater(it)}
// //                   >
// //                     Save for Later
// //                   </Button>
// //                   <Button 
// //                     variant="contained" 
// //                     color="error" 
// //                     size="medium" 
// //                     onClick={() => handleRemove(it.id)}
// //                   >
// //                     Remove
// //                   </Button>
// //                 </Box>
// //               </Box>
// //             </Paper>
// //           ))}
// //         </Box>
// //       )}

// //       {/* Saved for Later */}
// //       {!loading && savedForLater.length > 0 && (
// //         <Box mt={5} mb={4}>
// //           <Typography variant="h5"  color="#e8f4f8ff" fontWeight="bold" mb={2}>
// //             Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? "item" : "items"})
// //           </Typography>

// //           {savedForLater.map((it) => (
// //             <Paper key={it.id} sx={{ 
// //               display: "flex", 
// //               p: 2, 
// //               mb: 2, 
// //               border: "1px solid #ddd", 
// //               borderRadius: 3,
// //               background: "#fafafa" 
// //             }}>
// //               <Box sx={{ width: 120, mr: 2 }}>
// //                 <img 
// //                   src={it.image} 
// //                   alt={it.name} 
// //                   style={{ width: "100%", height: 120, objectFit: "contain" }} 
// //                 />
// //               </Box>
// //               <Box sx={{ flex: 1 }}>
// //                 <Typography variant="subtitle1" fontWeight={600}>{it.name}</Typography>
// //                 <Rating value={it.rating} readOnly size="small" />
// //                 <Typography fontWeight="bold" mt={1} color="#035700ff">₹{it.price.toFixed(2)}</Typography>
// //                 <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
// //                   <Button 
// //                     variant="contained" 
// //                     size="medium" 
// //                     onClick={() => handleMoveToCart(it)}
// //                   >
// //                     Move to Cart
// //                   </Button>
// //                   <Button 
// //                     variant="contained" 
// //                     color="error" 
// //                     size="medium" 
// //                     onClick={() => handleRemove(it.id)}
// //                   >
// //                     Remove
// //                   </Button>
// //                 </Box>
// //               </Box>
// //             </Paper>
// //           ))}
// //         </Box>
// //       )}

// //       {/* Total & Checkout */}
// //       {cartItems.length > 0 && (
// //         <Paper sx={{ 
// //           p: 1, 
// //           mt: 2, 
// //           textAlign: "right", 
// //           position: "sticky", 
// //           bottom: {xs: 70, md:0},
// //           background: "linear-gradient(135deg, #13283fff, #31568aff, #081e38ff)",
// //           borderRadius: 4,
// //           borderColor: "#cccccc", 
// //           borderWidth: 1, 
// //           borderStyle: "solid",
// //         }}>
// //           <Typography variant="h6" fontWeight="bold" mb={1} mt={1} color="#fff">
// //             Subtotal ({cartItems.reduce((s, it) => s + it.qty, 0)} items):
// //             <span style={{ color: "#ddeefcff", marginLeft: 8 }}>₹{total.toFixed(2)}</span>
// //           </Typography>
// //           <Button
// //             variant="contained"
// //             size="large"
// //             onClick={handleCheckout}
// //             disabled={checkoutLoading}
// //             sx={{ mt: 1, mb: 1, mr: 2, minWidth: 200, fontWeight: "bold" }}
// //           >
// //             {checkoutLoading ? <CircularProgress size={24} color="inherit" /> : "Proceed to Checkout"}
// //           </Button>
// //         </Paper>
// //       )}

// //       {/* Empty state */}
// //       {!loading && cartItems.length === 0 && savedForLater.length === 0 && (
// //         <Paper sx={{ p: 3, mt: 2, bgcolor: "#ecf0ffff", border: "1px solid #ffffffff", borderRadius: 3 }}>
// //           <Typography variant="h6" color="error" fontWeight="bold" mb={1}>
// //             Your cart is empty
// //           </Typography>
// //           <Typography variant="body2" color="#0b0047ff">
// //             Add some products to continue shopping.
// //           </Typography>
// //         </Paper>
// //       )}

// //       {/* Info when only saved items exist */}
// //       {!loading && cartItems.length === 0 && savedForLater.length > 0 && (
// //         <Paper sx={{ p: 3, mt: 2, bgcolor: "#fff3e0", border: "1px solid #ffb74d", borderRadius: 3 }}>
// //           <Typography variant="h6" fontWeight="bold" mb={1} color="#e65100">
// //             Your cart is empty
// //           </Typography>
// //           <Typography variant="body2" color="#5d4037">
// //             You have {savedForLater.length} {savedForLater.length === 1 ? "item" : "items"} saved for later. 
// //             Move them to cart to proceed with checkout.
// //           </Typography>
// //         </Paper>
// //       )}
// //     </Box>
// //   );
// // }


// import React, { useCallback, useEffect, useState } from "react";
// import "./CartPage.css";
// import {
//   updateCartItemApi,
//   checkoutApi,
//   getCartApi,
//   removeCartItemApi,
// } from "../../api/api";

// function debounce(fn, delay) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// }

// export default function CartPage({
//   cartItems,
//   setCartItems,
//   savedForLater,
//   setSavedForLater,
//   setTab,
//   fetchOrders,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const fetchCart = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.id) return;

//     setLoading(true);
//     try {
//       const res = await getCartApi(user.id);
//       if (Array.isArray(res.data)) {
//         const mapped = res.data.map((r) => {
//           const isSaved = r.is_saved === 1 || r.is_saved === true || r.is_saved === "1";
//           return {
//             id: r.cart_id,
//             productId: r.product_id,
//             name: r.name,
//             price: Number(r.price),
//             image: r.image,
//             qty: Number(r.qty),
//             rating: r.rating || 0,
//             is_saved: isSaved,
//           };
//         });

//         const activeCart = mapped.filter((i) => !i.is_saved);
//         const savedItems = mapped.filter((i) => i.is_saved);

//         setCartItems(activeCart);
//         setSavedForLater(savedItems);
//       } else {
//         setCartItems([]);
//         setSavedForLater([]);
//       }
//     } catch (err) {
//       console.error("Fetch cart failed:", err);
//       setMessage({ type: "error", text: "Failed to load cart" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const debouncedQtyUpdate = useCallback(
//     debounce(async (cartId, qty) => {
//       try {
//         await updateCartItemApi(cartId, qty, null);
//       } catch (err) {
//         console.error("Qty update failed:", err);
//         setMessage({ type: "error", text: "Failed to update quantity" });
//       }
//     }, 500),
//     []
//   );

//   const handleQtyChange = (cartId, newQty) => {
//     setCartItems((prev) =>
//       prev.map((item) => (item.id === cartId ? { ...item, qty: newQty } : item))
//     );
//     debouncedQtyUpdate(cartId, newQty);
//   };

//   const handleRemove = async (cartId) => {
//     const confirmDelete = window.confirm("Are you sure you want to remove this item from your cart?");
//     if (!confirmDelete) return;

//     try {
//       await removeCartItemApi(cartId);
//       setCartItems((prev) => prev.filter((i) => i.id !== cartId));
//       setSavedForLater((prev) => prev.filter((i) => i.id !== cartId));
//       setMessage({ type: "success", text: "Item removed from cart" });
//     } catch (err) {
//       console.error("Remove failed:", err);
//       setMessage({ type: "error", text: "Failed to remove item" });
//     }
//   };

//   const handleSaveForLater = async (item) => {
//     try {
//       await updateCartItemApi(item.id, item.qty, true);
//       setCartItems((prev) => prev.filter((i) => i.id !== item.id));
//       setSavedForLater((prev) => [...prev, { ...item, is_saved: true }]);
//       setMessage({ type: "success", text: "Item saved for later" });
//     } catch (err) {
//       console.error("Save for later failed:", err);
//       setMessage({ type: "error", text: "Failed to save for later" });
//       fetchCart();
//     }
//   };

//   const handleMoveToCart = async (item) => {
//     try {
//       await updateCartItemApi(item.id, item.qty, false);
//       setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
//       setCartItems((prev) => [...prev, { ...item, is_saved: false }]);
//       setMessage({ type: "success", text: "Item moved to cart" });
//     } catch (err) {
//       console.error("Move failed:", err);
//       setMessage({ type: "error", text: "Failed to move to cart" });
//       fetchCart();
//     }
//   };

//   const handleCheckout = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!cartItems || cartItems.length === 0) {
//       setMessage({
//         type: "warning",
//         text: "Your cart is empty! Move items from 'Saved for Later' to proceed.",
//       });
//       return;
//     }

//     try {
//       setCheckoutLoading(true);
//       const res = await checkoutApi(user.id);

//       if (res.data?.success) {
//         setMessage({
//           type: "success",
//           text: `Order placed successfully! Order ID: ${res.data.orderId}`,
//         });
//         setCartItems([]);
//         if (fetchOrders) fetchOrders();
//         setTimeout(() => setTab && setTab(3), 1500);
//       } else {
//         setMessage({ type: "error", text: res.data?.error || "Checkout failed" });
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//       setMessage({
//         type: "error",
//         text: err.response?.data?.error || "Checkout failed. Please try again.",
//       });
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
//   const itemCount = cartItems.reduce((s, it) => s + it.qty, 0);

//   const renderStars = (rating) => {
//     return (
//       <div className="rating-stars">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span key={star} className={star <= rating ? "star-filled" : "star-empty"}>★</span>
//         ))}
//         <span className="rating-text">{rating.toFixed(1)}</span>
//       </div>
//     );
//   };

//   return (
//     <div className="cart-page">
//       {message && (
//         <div className={`alert alert-${message.type}`}>
//           <span>{message.text}</span>
//           <button className="alert-close" onClick={() => setMessage(null)}>×</button>
//         </div>
//       )}

//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//         </div>
//       ) : (
//         <div className="cart-container">
//           <div className="cart-main">
//             {/* Active Cart Items */}
//             {cartItems.length > 0 && (
//               <div className="cart-section">
//                 <div className="section-header">
//                   <h1>Shopping Cart</h1>
//                   <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
//                   <span className="price-header">Price</span>
//                 </div>
//                 <div className="cart-divider"></div>

//                 {cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     <div className="item-image">
//                       <img src={item.image} alt={item.name} />
//                     </div>

//                     <div className="item-details">
//                       <h3 className="item-name">{item.name}</h3>
                      
//                       <div className="item-rating">
//                         {renderStars(item.rating)}
//                       </div>

//                       <p className="item-stock">In Stock</p>

//                       <div className="item-actions">
//                         <div className="qty-selector">
//                           <label htmlFor={`qty-${item.id}`}>Qty:</label>
//                           <select 
//                             id={`qty-${item.id}`}
//                             value={item.qty} 
//                             onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
//                           >
//                             {[...Array(10)].map((_, i) => (
//                               <option key={i + 1} value={i + 1}>{i + 1}</option>
//                             ))}
//                           </select>
//                         </div>
//                         <span className="action-divider">|</span>
//                         <button 
//                           className="action-link"
//                           onClick={() => handleRemove(item.id)}
//                         >
//                           Delete
//                         </button>
//                         <span className="action-divider">|</span>
//                         <button 
//                           className="action-link"
//                           onClick={() => handleSaveForLater(item)}
//                         >
//                           Save for later
//                         </button>
//                       </div>
//                     </div>

//                     <div className="item-price">
//                       <span className="price-amount">₹{item.price.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 ))}

//                 <div className="cart-subtotal">
//                   <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
//                   <strong>₹{total.toFixed(2)}</strong>
//                 </div>
//               </div>
//             )}

//             {/* Saved for Later */}
//             {savedForLater.length > 0 && (
//               <div className="saved-section">
//                 <h2 className="saved-header">Saved for later ({savedForLater.length})</h2>
//                 <div className="cart-divider"></div>

//                 {savedForLater.map((item) => (
//                   <div key={item.id} className="cart-item saved-item">
//                     <div className="item-image">
//                       <img src={item.image} alt={item.name} />
//                     </div>

//                     <div className="item-details">
//                       <h3 className="item-name">{item.name}</h3>
                      
//                       <div className="item-rating">
//                         {renderStars(item.rating)}
//                       </div>

//                       <p className="item-stock">In Stock</p>

//                       <div className="item-actions">
//                         <button 
//                           className="action-link"
//                           onClick={() => handleMoveToCart(item)}
//                         >
//                           Move to cart
//                         </button>
//                         <span className="action-divider">|</span>
//                         <button 
//                           className="action-link"
//                           onClick={() => handleRemove(item.id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>

//                     <div className="item-price">
//                       <span className="price-amount">₹{item.price.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Empty State */}
//             {cartItems.length === 0 && savedForLater.length === 0 && (
//               <div className="cart-section empty-cart">
//                 <svg className="empty-cart-icon" viewBox="0 0 24 24" fill="none">
//                   <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="#ccc"/>
//                 </svg>
//                 <h2>Your cart is empty</h2>
//                 <p>Add items to your cart to see them here.</p>
//               </div>
//             )}

//             {/* Cart Empty But Has Saved Items */}
//             {cartItems.length === 0 && savedForLater.length > 0 && (
//               <div className="info-banner">
//                 <svg viewBox="0 0 24 24" fill="none">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ff9900"/>
//                 </svg>
//                 <span>Your cart is empty. You have {savedForLater.length} {savedForLater.length === 1 ? 'item' : 'items'} saved for later.</span>
//               </div>
//             )}
//           </div>

//           {/* Sidebar Summary */}
//           {cartItems.length > 0 && (
//             <div className="cart-sidebar">
//               <div className="sidebar-card">
//                 <div className="sidebar-subtotal">
//                   <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
//                   <strong className="sidebar-price">₹{total.toFixed(2)}</strong>
//                 </div>
                
//                 <button 
//                   className="checkout-btn"
//                   onClick={handleCheckout}
//                   disabled={checkoutLoading}
//                 >
//                   {checkoutLoading ? (
//                     <span className="btn-spinner"></span>
//                   ) : (
//                     'Proceed to Checkout'
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



// import React, { useCallback, useEffect, useState } from "react";
// import "./CartPage.css";
// import {
//   updateCartItemApi,
//   checkoutApi,
//   getCartApi,
//   removeCartItemApi,
// } from "../../api/api";

// function debounce(fn, delay) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// }

// export default function CartPage({
//   cartItems,
//   setCartItems,
//   savedForLater,
//   setSavedForLater,
//   setTab,
//   fetchOrders,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const fetchCart = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user?.id) return;

//     setLoading(true);
//     try {
//       const res = await getCartApi(user.id);
//       if (Array.isArray(res.data)) {
//         const mapped = res.data.map((r) => {
//           const isSaved = r.is_saved === 1 || r.is_saved === true || r.is_saved === "1";
//           return {
//             id: r.cart_id,
//             productId: r.product_id,
//             name: r.name,
//             price: Number(r.price),
//             image: r.image,
//             qty: Number(r.qty),
//             rating: r.rating || 0,
//             is_saved: isSaved,
//           };
//         });

//         const activeCart = mapped.filter((i) => !i.is_saved);
//         const savedItems = mapped.filter((i) => i.is_saved);

//         setCartItems(activeCart);
//         setSavedForLater(savedItems);
//       } else {
//         setCartItems([]);
//         setSavedForLater([]);
//       }
//     } catch (err) {
//       console.error("Fetch cart failed:", err);
//       setMessage({ type: "error", text: "Failed to load cart" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const debouncedQtyUpdate = useCallback(
//     debounce(async (cartId, qty) => {
//       try {
//         await updateCartItemApi(cartId, qty, null);
//       } catch (err) {
//         console.error("Qty update failed:", err);
//         setMessage({ type: "error", text: "Failed to update quantity" });
//       }
//     }, 500),
//     []
//   );

//   const handleQtyChange = (cartId, newQty) => {
//     setCartItems((prev) =>
//       prev.map((item) => (item.id === cartId ? { ...item, qty: newQty } : item))
//     );
//     debouncedQtyUpdate(cartId, newQty);
//   };

//   const handleRemove = async (cartId) => {
//     const confirmDelete = window.confirm("Are you sure you want to remove this item from your cart?");
//     if (!confirmDelete) return;

//     try {
//       await removeCartItemApi(cartId);
//       setCartItems((prev) => prev.filter((i) => i.id !== cartId));
//       setSavedForLater((prev) => prev.filter((i) => i.id !== cartId));
//       setMessage({ type: "success", text: "Item removed from cart" });
//     } catch (err) {
//       console.error("Remove failed:", err);
//       setMessage({ type: "error", text: "Failed to remove item" });
//     }
//   };

//   const handleSaveForLater = async (item) => {
//     try {
//       await updateCartItemApi(item.id, item.qty, true);
//       setCartItems((prev) => prev.filter((i) => i.id !== item.id));
//       setSavedForLater((prev) => [...prev, { ...item, is_saved: true }]);
//       setMessage({ type: "success", text: "Item saved for later" });
//     } catch (err) {
//       console.error("Save for later failed:", err);
//       setMessage({ type: "error", text: "Failed to save for later" });
//       fetchCart();
//     }
//   };

//   const handleMoveToCart = async (item) => {
//     try {
//       await updateCartItemApi(item.id, item.qty, false);
//       setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
//       setCartItems((prev) => [...prev, { ...item, is_saved: false }]);
//       setMessage({ type: "success", text: "Item moved to cart" });
//     } catch (err) {
//       console.error("Move failed:", err);
//       setMessage({ type: "error", text: "Failed to move to cart" });
//       fetchCart();
//     }
//   };

//   const handleCheckout = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!cartItems || cartItems.length === 0) {
//       setMessage({
//         type: "warning",
//         text: "Your cart is empty! Move items from 'Saved for Later' to proceed.",
//       });
//       return;
//     }

//     try {
//       setCheckoutLoading(true);
//       const res = await checkoutApi(user.id);

//       if (res.data?.success) {
//         setMessage({
//           type: "success",
//           text: `Order placed successfully! Order ID: ${res.data.orderId}`,
//         });
//         setCartItems([]);
//         if (fetchOrders) fetchOrders();
//         setTimeout(() => setTab && setTab(3), 1500);
//       } else {
//         setMessage({ type: "error", text: res.data?.error || "Checkout failed" });
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//       setMessage({
//         type: "error",
//         text: err.response?.data?.error || "Checkout failed. Please try again.",
//       });
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   const total = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
//   const itemCount = cartItems.reduce((s, it) => s + it.qty, 0);

//   const renderStars = (rating) => {
//     return (
//       <div className="rating-stars">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span key={star} className={star <= rating ? "star-filled" : "star-empty"}>★</span>
//         ))}
//         <span className="rating-text">{rating.toFixed(1)}</span>
//       </div>
//     );
//   };

//   return (
//     <div className="cart-page">
//       {message && (
//         <div className={`alert alert-${message.type}`}>
//           <span>{message.text}</span>
//           <button className="alert-close" onClick={() => setMessage(null)}>×</button>
//         </div>
//       )}

//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//         </div>
//       ) : (
//         <div className="cart-container">
//           <div className="cart-main">
//             {/* Active Cart Items */}
//             {cartItems.length > 0 && (
//               <div className="cart-section">
//                 <div className="section-header">
//                   <h1>Shopping Cart</h1>
//                   <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
//                   <span className="price-header">Price</span>
//                 </div>
//                 <div className="cart-divider"></div>

//                 {cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     <div className="item-image">
//                       <img src={item.image} alt={item.name} />
//                     </div>

//                     <div className="item-details">
//                       <h3 className="item-name">{item.name}</h3>
                      
//                       <div className="item-rating">
//                         {renderStars(item.rating)}
//                       </div>

//                       <p className="item-stock">In Stock</p>

//                       <div className="item-actions">
//                         <div className="qty-selector">
//                           <label htmlFor={`qty-${item.id}`}>Qty:</label>
//                           <select 
//                             id={`qty-${item.id}`}
//                             value={item.qty} 
//                             onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
//                           >
//                             {[...Array(10)].map((_, i) => (
//                               <option key={i + 1} value={i + 1}>{i + 1}</option>
//                             ))}
//                           </select>
//                         </div>
//                         <span className="action-divider">|</span>
//                         <button 
//                           className="action-link"
//                           onClick={() => handleRemove(item.id)}
//                         >
//                           Delete
//                         </button>
//                         <span className="action-divider">|</span>
//                         <button 
//                           className="action-link"
//                           onClick={() => handleSaveForLater(item)}
//                         >
//                           Save for later
//                         </button>
//                       </div>
//                     </div>

//                     <div className="item-price">
//                       <span className="price-amount">₹{item.price.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 ))}

//                 <div className="cart-subtotal">
//                   <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
//                   <strong>₹{total.toFixed(2)}</strong>
//                 </div>
//               </div>
//             )}

//             {/* Saved for Later */}
//             {savedForLater.length > 0 && (
//               <div className="saved-section">
//                 <h2 className="saved-header">Saved for later ({savedForLater.length})</h2>
//                 <div className="cart-divider"></div>

//                 {savedForLater.map((item) => (
//                   <div key={item.id} className="cart-item saved-item">
//                     <div className="item-image">
//                       <img src={item.image} alt={item.name} />
//                     </div>

//                     <div className="item-details">
//                       <h3 className="item-name">{item.name}</h3>
                      
//                       <div className="item-rating">
//                         {renderStars(item.rating)}
//                       </div>

//                       <p className="item-stock">In Stock</p>

//                       <div className="item-actions">
//                         <button 
//                           className="action-link"
//                           onClick={() => handleMoveToCart(item)}
//                         >
//                           Move to cart
//                         </button>
//                         <span className="action-divider">|</span>
//                         <button 
//                           className="action-link"
//                           onClick={() => handleRemove(item.id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>

//                     <div className="item-price">
//                       <span className="price-amount">₹{item.price.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Empty State */}
//             {cartItems.length === 0 && savedForLater.length === 0 && (
//               <div className="cart-section empty-cart">
//                 <svg className="empty-cart-icon" viewBox="0 0 24 24" fill="none">
//                   <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="#ccc"/>
//                 </svg>
//                 <h2>Your cart is empty</h2>
//                 <p>Add items to your cart to see them here.</p>
//               </div>
//             )}

//             {/* Cart Empty But Has Saved Items */}
//             {cartItems.length === 0 && savedForLater.length > 0 && (
//               <div className="info-banner">
//                 <svg viewBox="0 0 24 24" fill="none">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ff9900"/>
//                 </svg>
//                 <span>Your cart is empty. You have {savedForLater.length} {savedForLater.length === 1 ? 'item' : 'items'} saved for later.</span>
//               </div>
//             )}
//           </div>

//           {/* Sidebar Summary - Desktop & Mobile */}
//           {cartItems.length > 0 && (
//             <div className="cart-sidebar">
//               <div className="sidebar-card">
//                 <div className="sidebar-subtotal">
//                   <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
//                   <strong className="sidebar-price">₹{total.toFixed(2)}</strong>
//                 </div>
                
//                 <button 
//                   className="checkout-btn"
//                   onClick={handleCheckout}
//                   disabled={checkoutLoading}
//                 >
//                   {checkoutLoading ? (
//                     <>
//                       <span className="btn-spinner"></span>
//                       <span style={{ marginLeft: '8px' }}>Processing...</span>
//                     </>
//                   ) : (
//                     'Proceed to Checkout'
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }














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
  Divider,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import {
  updateCartItemApi,
  checkoutApi,
  getCartApi,
  removeCartItemApi,
} from "../../api/api";

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
  savedForLater,
  setSavedForLater,
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
      console.log("Raw cart data from backend:", res.data);

      if (Array.isArray(res.data)) {
        const mapped = res.data.map((r) => {
          const isSaved = r.is_saved === 1 || r.is_saved === true || r.is_saved === "1";
          
          console.log(`Item ${r.cart_id}: is_saved raw = ${r.is_saved}, parsed = ${isSaved}`);
          
          return {
            id: r.cart_id,
            productId: r.product_id,
            name: r.name,
            price: Number(r.price),
            image: r.image,
            qty: Number(r.qty),
            rating: r.rating || 0,
            is_saved: isSaved,
          };
        });

        const activeCart = mapped.filter((i) => !i.is_saved);
        const savedItems = mapped.filter((i) => i.is_saved);

        console.log("Active cart items:", activeCart.length);
        console.log("Saved for later items:", savedItems.length);

        setCartItems(activeCart);
        setSavedForLater(savedItems);
      } else {
        setCartItems([]);
        setSavedForLater([]);
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
    const confirmDelete = window.confirm("Are you sure you want to remove this item from your cart?");
    if (!confirmDelete) return;

    try {
      await removeCartItemApi(cartId);
      setCartItems((prev) => prev.filter((i) => i.id !== cartId));
      setSavedForLater((prev) => prev.filter((i) => i.id !== cartId));
      setMessage({ type: "success", text: "Item removed" });
    } catch (err) {
      console.error("Remove failed:", err);
      setMessage({ type: "error", text: "Failed to remove item" });
    }
  };

  // ---------------- SAVE FOR LATER ----------------
  const handleSaveForLater = async (item) => {
    try {
      await updateCartItemApi(item.id, item.qty, true);
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));
      setSavedForLater((prev) => [...prev, { ...item, is_saved: true }]);
      setMessage({ type: "success", text: "Saved for later" });
    } catch (err) {
      console.error("Save for later failed:", err);
      setMessage({ type: "error", text: "Failed to save for later" });
      fetchCart();
    }
  };

  // ---------------- MOVE TO CART ----------------
  const handleMoveToCart = async (item) => {
    try {
      await updateCartItemApi(item.id, item.qty, false);
      setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
      setCartItems((prev) => [...prev, { ...item, is_saved: false }]);
      setMessage({ type: "success", text: "Moved to cart" });
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

        setCartItems([]);

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
  const totalItems = cartItems.reduce((s, it) => s + it.qty, 0);

  // ---------------- UI ----------------
  return (
    <Box sx={{ 
      background: "linear-gradient(135deg, #e5eafdff 0%, #d7e3fdff 100%)",
      minHeight: "100vh",
      pb: { xs: 10, md: 4 }
    }}>
      <Box sx={{ 
        maxWidth: 1400, 
        mx: "auto", 
        px: { xs: 2, md: 3 }, 
        py: 3 
      }}>
        {message && (
          <Alert 
            severity={message.type} 
            onClose={() => setMessage(null)} 
            sx={{ mb: 2, borderRadius: 1 }}
          >
            {message.text}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (cartItems.length > 0 || savedForLater.length > 0) && (
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
            {/* LEFT COLUMN - Cart Items */}
            <Box sx={{ flex: 1 }}>
              {/* Active Cart */}
              {cartItems.length > 0 && (
                <Paper sx={{ mb: 2, borderRadius: 3, overflow: "hidden" }}>
                  <Box sx={{ 
                    bgcolor: "#fff", 
                    p: 3, 
                    borderBottom: "1px solid #ddd" ,
                    mb: 0
                  }}>
                    <Typography variant="h5" fontWeight={600} color="#0F1111">
                      Shopping Cart
                    </Typography>
                    <Typography variant="body2" color="#565959" mt={0} mb={-1}>
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: "#fff" }}>
                    {cartItems.map((it, index) => (
                      <React.Fragment key={it.id}>
                        <Box sx={{ 
                          p: 5,
                          display: "flex",
                          gap: {xs:2,md:9},
flexDirection: "row",
alignItems: "flex-start",
                        }}>
                          {/* Product Image */}
<Box sx={{
  width: {xs:110,md:150},
  height: {xs:110,md:150},
  ml:-1,
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}>
  <img
    src={it.image}
    alt={it.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
</Box>


                          {/* Product Details */}
<Box sx={{ flex: 1, minWidth: 0 }}>
  <Typography 
    variant="body1"
    fontWeight={{xs:"520",md:"530"}}
    color="#0F1111"
    sx={{
      mb: 0.5,
      fontSize: {xs:"0.9rem",md:"1.0rem"},
      fontWeight:600,
      lineHeight: 1.2,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }}
  >
    {it.name}
  </Typography>

  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
    <Rating value={it.rating} readOnly size="small" />
    <Typography variant="caption" color="#007185">({it.rating})</Typography>
  </Box>

  <Typography variant="body2" color="#007600" sx={{ mb: 0.5 }}>
    In Stock
  </Typography>

  <Typography variant="h7" fontWeight={700} color="#B12704" sx={{ mb: 1 }}>
    ₹{it.price.toFixed(2)}
  </Typography>

<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}> 
  <Typography variant="body2" color="#565959" sx={{ mr: 1 }} > Qty: </Typography> 
  <TextField 
  select size="small" SelectProps={{ native: true }} value={it.qty} onChange={(e) => 
  handleQtyChange(it.id, parseInt(e.target.value))} 
  sx={{ width: 70, "& .MuiOutlinedInput-root": {
     bgcolor: "#F0F2F2", borderRadius: 1,
      fontSize: "0.875rem" } }} > {[...Array(10)].map((_, i) => ( 
      <option key={i + 1} value={i + 1}> {i + 1} </option> ))}
       </TextField> 
       </Box>

  <Box sx={{ display: "flex", gap: 0 }}>
    <Button
      size="small"
      onClick={() => handleRemove(it.id)}
                                sx={{
                                  color: "#007185",
                                  textTransform: "none",
                                  fontSize: "0.875rem",
                                  fontWeight: 400,
                                  p: 0,
                                  minWidth: "auto",
                                  "&:hover": {
                                    bgcolor: "transparent",
                                    color: "#C7511F",
                                    textDecoration: "underline"
                                  }
                                }}
    >
      Delete
    </Button>
<Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: "center",ml:1,mr:1 }} />
    <Button
      size="small"
      onClick={() => handleSaveForLater(it)}
                                sx={{
                                  color: "#007185",
                                  textTransform: "none",
                                  fontSize: "0.875rem",
                                  fontWeight: 400,
                                  p: 0,
                                  minWidth: "auto",
                                  "&:hover": {
                                    bgcolor: "transparent",
                                    color: "#C7511F",
                                    textDecoration: "underline"
                                  }
                                }}
    >
      Save for later
    </Button>
  </Box>
</Box>

                        </Box>
                        {index < cartItems.length - 1 && (
                          <Divider sx={{ mx: 2.5,mt:-2 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>

                  {/* Cart Subtotal at Bottom */}
                  <Box sx={{ 
                    bgcolor: "#fff", 
                    p: 2.5, 
                    borderTop: "1px solid #ddd",
                    textAlign: "right" 
                  }}>
                    <Typography variant="h6" color="#0F1111">
                      Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}): 
                      <span style={{ fontWeight: 600, marginLeft: 8 }}>
                        ₹{total.toFixed(2)}
                      </span>
                    </Typography>
                  </Box>
                </Paper>
              )}

              {/* Saved for Later */}
              {savedForLater.length > 0 && (
                <Paper sx={{ borderRadius: 1, overflow: "hidden" }}>
                  <Box sx={{ 
                    bgcolor: "#fff", 
                    p: 2.5, 
                    borderBottom: "1px solid #ddd" 
                  }}>
                    <Typography variant="h6" fontWeight={600} color="#0F1111">
                      Saved for later
                    </Typography>
                    <Typography variant="body2" color="#565959" mt={0.5}>
                      {savedForLater.length} {savedForLater.length === 1 ? "item" : "items"}
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: "#fff" }}>
                    {savedForLater.map((it, index) => (
                      <React.Fragment key={it.id}>
                        <Box sx={{ 
                          p: 5,
                          display: "flex",
                          gap: {xs:2,md:9},
flexDirection: "row",
alignItems: "flex-start",                        }}>
<Box sx={{
  width: {xs:110,md:150},
  height: {xs:110,md:150},
  ml:-1,
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}>
  <img
    src={it.image}
    alt={it.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
</Box>

<Box sx={{ flex: 1, minWidth: 0 }}>
  <Typography 
    variant="body1"
    fontWeight={{xs:"520",md:"530"}}
    color="#0F1111"
    sx={{
      mb: 0.5,
      mt:{xs:2,md:3},
      fontSize: {xs:"0.9rem",md:"1.0rem"},
      fontWeight:600,
      lineHeight: 1.2,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }}
                            >
                              {it.name}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              <Rating value={it.rating} readOnly size="small" precision={0.5} />
                              <Typography variant="caption" color="#007185">
                                ({it.rating})
                              </Typography>
                            </Box>

  <Typography variant="h7" fontWeight={700} color="#B12704" sx={{ mb: 1 }}>

                              ₹{it.price.toFixed(2)}
                            </Typography>

                            <Box sx={{ 
                              display: "flex", 
                              gap: 2, 
                              flexWrap: "wrap",
                              alignItems: "center"
                            }}>
                              <Button
                                size="small"
                                onClick={() => handleMoveToCart(it)}
                                sx={{
                                  color: "#007185",
                                  textTransform: "none",
                                  fontSize: "0.875rem",
                                  fontWeight: 400,
                                  p: 0,
                                  minWidth: "auto",
                                  "&:hover": {
                                    bgcolor: "transparent",
                                    color: "#C7511F",
                                    textDecoration: "underline"
                                  }
                                }}
                              >
                                Move to cart
                              </Button>
                              <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: "center",ml:-1,mr:-1 }} />
                              <Button
                                size="small"
                                onClick={() => handleRemove(it.id)}
                                sx={{
                                  color: "#007185",
                                  textTransform: "none",
                                  fontSize: "0.875rem",
                                  fontWeight: 400,
                                  p: 0,
                                  minWidth: "auto",
                                  "&:hover": {
                                    bgcolor: "transparent",
                                    color: "#C7511F",
                                    textDecoration: "underline"
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                        {index < savedForLater.length - 1 && (
                          <Divider sx={{ mx: 2.5 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>

            {/* RIGHT COLUMN - Checkout Summary (Desktop only) */}
            {cartItems.length > 0 && (
              <Box sx={{ 
                width: { md: 320 },
                flexShrink: 0,
                display: { xs: "none", md: "block" }
              }}>
                <Paper sx={{ 
                  p: 2.5, 
                  position: "sticky",
                  top: 20,
                  borderRadius: 1
                }}>
                  <Typography 
                    variant="h6" 
                    color="#5a5a5aff"
                    sx={{ mb: 2 }}
                  >
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}): 
                    <span style={{ fontWeight: 700, marginLeft: 40,color:"#000000ff" }}>
                      ₹{total.toFixed(2)}
                    </span>
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    startIcon={checkoutLoading ? null : <ShoppingCartCheckoutIcon />}
                    sx={{
                      bgcolor: "#000263ff",
                      color: "#ffffffff",
                      textTransform: "none",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      py: 1.2,
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(213,217,217,.5)",
                      "&:hover": {
                        bgcolor: "#00013fff"
                      },
                      "&:disabled": {
                        bgcolor: "#F7F8F8",
                        color: "#565959"
                      }
                    }}
                  >
                    {checkoutLoading ? (
                      <CircularProgress size={24} sx={{ color: "#0F1111" }} />
                    ) : (
                      "Proceed to checkout"
                    )}
                  </Button>
                </Paper>
              </Box>
            )}
          </Box>
        )}

        {/* Empty Cart State */}
        {!loading && cartItems.length === 0 && savedForLater.length === 0 && (
          <Paper sx={{ 
            p: 5, 
            textAlign: "center",
            borderRadius: 1,
            bgcolor: "#fff",
            mt:2
          }}>
            <ShoppingCartCheckoutIcon 
              sx={{ fontSize: 80, color: "#C7C7C7", mb: 2 }} 
            />
            <Typography variant="h5" fontWeight={600} color="#0F1111" mb={1}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="#565959">
              Add items to get started
            </Typography>
          </Paper>
        )}

        {/* Cart Empty but Saved Items Exist */}
        {!loading && cartItems.length === 0 && savedForLater.length > 0 && (
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            mt:2,
            bgcolor: "#FFF8E1",
            border: "1px solid #FFD54F",
            borderRadius: 1
          }}>
            <Typography variant="h6" fontWeight={600} color="#FF6F00" mb={1}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="#5D4037">
              You have {savedForLater.length} {savedForLater.length === 1 ? "item" : "items"} saved for later. 
              Move them to cart to proceed with checkout.
            </Typography>
          </Paper>
        )}

        {/* Mobile Checkout Button (Sticky) */}
        {cartItems.length > 0 && (
          <Paper sx={{ 
            position: "fixed",
            bottom: 50,
            left: 0,
            right: 0,
            p: 2,
            display: { xs: "block", md: "none" },
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
            borderRadius: 0
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              mb: 1.5
            }}>
              <Typography variant="body2" color="#525252ff" sx={{fontSize:"17px"}}>
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}):
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#0F1111">
                ₹{total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              disabled={checkoutLoading}
              startIcon={checkoutLoading ? null : <ShoppingCartCheckoutIcon />}
              sx={{
                bgcolor: "#070063ff",
                color: "#ffffffff",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                py: 1,
                borderRadius: 2,
                mb:1,
                boxShadow: "0 2px 5px rgba(213,217,217,.5)",
                "&:hover": {
                  bgcolor: "#011969ff"
                },
                "&:disabled": {
                  bgcolor: "#F7F8F8",
                  color: "#565959"
                }
              }}
            >
              {checkoutLoading ? (
                <CircularProgress size={24} sx={{ color: "#0F1111" }} />
              ) : (
                "Proceed to checkout"
              )}
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}