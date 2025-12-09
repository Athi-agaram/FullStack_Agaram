// import React from "react";
// import { 
//   Box, Typography, Button, Card, CardMedia, CardContent, Grid ,Paper
// } from "@mui/material";
// import { addToCartApi, removeWishlistApi } from "../../api/api";

// export default function WishlistPage({ 
//   userId, 
//   wishlistItems, 
//   setWishlistItems,
//   cartItems,
//   setCartItems 
// }) {

//   // -------------------------
//   // SAFE REMOVE (with confirm)
//   // -------------------------
//   const handleRemove = async (wishlistId) => {
//     const confirmDelete = window.confirm("Are you sure you want to remove this item?");
//     if (!confirmDelete) return;

//     try {
//       await removeWishlistApi(userId, wishlistId);

//       setWishlistItems(prev => (prev || []).filter(i => i.wishlist_id !== wishlistId));
//     } catch (err) {
//       console.error("Error removing wishlist item:", err);
//       alert("Error removing item from wishlist");
//     }
//   };

//   // -----------------------------------------
//   // REMOVE WITHOUT CONFIRM (for Add-to-Cart)
//   // -----------------------------------------
//   const forceRemove = async (wishlistId) => {
//     try {
//       await removeWishlistApi(userId, wishlistId);

//       setWishlistItems(prev => (prev || []).filter(i => i.wishlist_id !== wishlistId));
//     } catch (err) {
//       console.error("Error removing wishlist item:", err);
//     }
//   };

//   // -------------------------
//   // ADD ITEM TO CART
//   // -------------------------
//   const handleAddToCart = async (item) => {
//     try {
//       if (!userId) {
//         alert("Please login");
//         return;
//       }

//       await addToCartApi({ userId, productId: item.id, qty: 1 });

//       // Update cart state
//       setCartItems(prev => {
//         const existing = prev.find(x => x.product_id === item.id);
//         if (existing) {
//           return prev.map(x =>
//             x.product_id === item.id ? { ...x, qty: x.qty + 1 } : x
//           );
//         }
//         return [...prev, { product_id: item.id, qty: 1 }];
//       });

//       // Remove from wishlist WITHOUT confirmation
//       await forceRemove(item.wishlist_id);

//       alert("Added to cart!");
//     } catch (err) {
//       console.error("Error adding to cart:", err);
//       alert("Error adding to cart");
//     }
//   };

//   // -------------------------
//   // EMPTY STATE
//   // -------------------------
//   if (!wishlistItems || wishlistItems.length === 0) {
//     return (
//       <Box sx={{p:2,background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)", 
//       minHeight: "100%" }} >
//         <Paper sx={{ p: 3, mt: 2, bgcolor: "#ecf0ffff", border: "1px solid #ffffffff", borderRadius: 3 }}>
//           <Typography variant="h6" color="error" fontWeight="bold" mb={1}>
//             Your wishlist is empty
//           </Typography>
//           <Typography variant="body2" color="#0b0047ff">
//             Add some products to continue shopping.
//           </Typography>
//         </Paper>
//         </Box>
//     );
//   }


//   // -------------------------
//   // MAIN VIEW
//   // -------------------------
//   return (
//     <Box 
//       sx={{ 
//         p: { xs: 2, md: 10.5 },
        
//         background: "linear-gradient(135deg, #10002e 0%, #87c8ee 100%)",
//         minHeight: "100%"
//       }}
//     >
//       <Grid container spacing={3}>
//         {wishlistItems.map((item) => (
//           <Grid item xs={1} sm={6} md={4} lg={4} key={item.wishlist_id}>
//             <Card
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 p: 3,
//                 height: "380px",
//                 width: "360px",
//                 borderRadius: 3,
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 transition: "transform 0.2s",
//                 "&:hover": {
//                   transform: "translateY(-3px)",
//                   boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
//                 }
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 image={item.image || "https://via.placeholder.com/120"}
//                 alt={item.product_name || item.name}
//                 sx={{
//                   width: "100%",
//                   height: 160,
//                   objectFit: "contain",
//                   borderRadius: 2,
//                   bgcolor: "#fff",
//                   mb: 2
//                 }}
//               />

//               <CardContent
//                 sx={{ flex: 1, p: 0, width: "100%", textAlign: "center" }}
//               >
//                 <Typography variant="h6" fontWeight="bold" noWrap>
//                   {item.product_name || item.name}
//                 </Typography>

//                 <Typography
//                   variant="subtitle1"
//                   color="green"
//                   fontWeight={600}
//                   mt={0.5}
//                 >
//                   ₹{item.product_price || item.price}
//                 </Typography>

//                 <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  
//                   {/* Add to Cart */}
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     onClick={() => handleAddToCart(item)}
//                     sx={{
//                       textTransform: "none",
//                       fontWeight: 600,
//                       height: 40,
//                       borderRadius: 2
//                     }}
//                   >
//                     Add to Cart
//                   </Button>

//                   {/* Remove with confirmation */}
//                   <Button
//                     variant="contained"
//                     color="error"
//                     fullWidth
//                     onClick={() => handleRemove(item.wishlist_id)}
//                     sx={{
//                       textTransform: "none",
//                       fontWeight: 600,
//                       height: 40,
//                       borderRadius: 2
//                     }}
//                   >
//                     Remove
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }





import React from "react";
import "./WishListPage.css";
import { removeWishlistApi } from "../../api/api";
import { addToCartApi } from "../../api/api";

export default function WishlistPage({ 
  userId, 
  wishlistItems, 
  setWishlistItems,
  cartItems,
  setCartItems 
}) {

  const handleRemove = async (wishlistId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item from your wishlist?");
    if (!confirmDelete) return;

    try {
      await removeWishlistApi(userId, wishlistId);
      setWishlistItems(prev => (prev || []).filter(i => i.wishlist_id !== wishlistId));
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      alert("Error removing item from wishlist");
    }
  };

  const forceRemove = async (wishlistId) => {
    try {
      await removeWishlistApi(userId, wishlistId);
      setWishlistItems(prev => (prev || []).filter(i => i.wishlist_id !== wishlistId));
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      if (!userId) {
        alert("Please login to add items to cart");
        return;
      }

      await addToCartApi({ userId, productId: item.id, qty: 1 });

      setCartItems(prev => {
        const existing = prev.find(x => x.product_id === item.id);
        if (existing) {
          return prev.map(x =>
            x.product_id === item.id ? { ...x, qty: x.qty + 1 } : x
          );
        }
        return [...prev, { product_id: item.id, qty: 1 }];
      });

      await forceRemove(item.wishlist_id);
      alert("Item moved to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding to cart");
    }
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="empty-wishlist">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e0e0e0"/>
          </svg>
          <h2>Your Wishlist is Empty</h2>
          <p>Add items that you like to your wishlist. Review them anytime and easily move them to the bag.</p>
          <button className="btn-continue">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <div className="product-card" key={item.wishlist_id}>
            <button 
              className="remove-btn"
              onClick={() => handleRemove(item.wishlist_id)}
              aria-label="Remove from wishlist"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="red"/>
              </svg>
            </button>

            <div className="product-image">
              <img 
                src={item.image || "https://via.placeholder.com/150"} 
                alt={item.product_name || item.name}
              />
            </div>

            <div className="product-details">
              <h3 className="product-name">{item.product_name || item.name}</h3>
              <div className="price-container">
                <span className="price">₹{item.product_price || item.price}</span>
              </div>
              <button 
                className="btn-add-cart"
                onClick={() => handleAddToCart(item)}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
                </svg>
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="wishlist-footer">
        <p>Items in your wishlist are saved for later. Move them to cart when you're ready to buy.</p>
      </div>
    </div>
  );
}












