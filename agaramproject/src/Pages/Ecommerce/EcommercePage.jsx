// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Badge,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   CssBaseline,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// import MenuIcon from "@mui/icons-material/Menu";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import CategoryIcon from "@mui/icons-material/Category";
// import Inventory2Icon from "@mui/icons-material/Inventory2";
// import AssignmentIcon from "@mui/icons-material/Assignment";

// import CategoriesPage from "./CategoriesPage";
// import ProductGrid from "./components/ProductGrid";
// import CartPage from "./CartPage";
// import OrdersPage from "./OrderPage";
// import WishlistPage from "./WishListPage";
// import productsData from "./components/products.json";
// import { getWishlistApi, getCartApi } from "../../api/api";

// const drawerWidth = 220;

// const openedMixin = (theme) => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme) => ({
//   width: "60px",
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
// });

// const Drawer = styled("div")(({ theme, open }) => ({
//   height: "100%",
//   whiteSpace: "nowrap",
//   flexShrink: 0,
//   position: "sticky",
//   top: 0,
//   background: "linear-gradient(180deg, #f3f5ffff 0%, #a4c9ffff 100%)",
//   borderRight: "none",
//   overflow: "hidden",
//   display: "flex",
//   flexDirection: "column",
//   boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
//   ...(open ? openedMixin(theme) : closedMixin(theme)),
// }));

// export default function EcommercePage() {
//   const [open, setOpen] = useState(false);
//   const [tab, setTab] = useState(0);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [user, setUser] = useState(null);

//   const [cartItems, setCartItems] = useState([]);
//   const [savedForLater, setSavedForLater] = useState([]);
//   const [wishlistItems, setWishlistItems] = useState([]);

//   const switchToProductsTab = () => {
//     setTab(1);
//   };

//   // Load user on mount
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     setUser(storedUser);
//   }, []);

//   // Load wishlist + cart
//   useEffect(() => {
//     const loadData = async () => {
//       if (user?.id) {
//         try {
//           // Fetch wishlist
//           const wishlistRes = await getWishlistApi(user.id);
//           if (Array.isArray(wishlistRes.data)) {
//             const wishlistProducts = wishlistRes.data.map((item) => ({
//               id: item.product_id,
//               wishlist_id: item.id,
//               name: item.product_name,
//               image: item.image,
//               price: item.product_price,
//             }));
//             setWishlistItems(wishlistProducts);
//           }

//           // Fetch cart and separate active cart from saved for later
//           const cartRes = await getCartApi(user.id);
//           if (Array.isArray(cartRes.data)) {
//             const mapped = cartRes.data.map((r) => {
//               const isSaved = r.is_saved === 1 || r.is_saved === true || r.is_saved === "1";
              
//               return {
//                 id: r.cart_id || r.id,
//                 productId: r.product_id,
//                 name: r.name,
//                 price: Number(r.price),
//                 image: r.image,
//                 qty: Number(r.qty),
//                 rating: r.rating || r.rating_stars || 0,
//                 is_saved: isSaved,
//               };
//             });

//             // Separate active cart items from saved for later
//             const activeCart = mapped.filter((item) => !item.is_saved);
//             const savedItems = mapped.filter((item) => item.is_saved);

//             setCartItems(activeCart);
//             setSavedForLater(savedItems);
//           } else {
//             setCartItems([]);
//             setSavedForLater([]);
//           }
//         } catch (err) {
//           console.error("Error loading data:", err);
//         }
//       }
//     };
//     loadData();
//   }, [user]);

//   const drawerItems = [
//     { label: "Categories", tab: 0, icon: <CategoryIcon /> },
//     { label: "Products", tab: 1, icon: <Inventory2Icon /> },
//     { label: "Orders", tab: 3, icon: <AssignmentIcon /> },
//   ];

//   return (
//     <Box sx={{ height: "90vh", display: "flex", overflow: "hidden" }}>
//       <CssBaseline />

//       {/* Sidebar */}
//       <Drawer open={open}>
//         <Box
//           sx={{
//             height: 56,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: open ? "flex-end" : "center",
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//             background: "#f3f5ffff",
//             backdropFilter: "blur(10px)",
//             zIndex: 10,
//           }}
//         >
//           <IconButton 
//             onClick={() => setOpen(!open)} 
//             sx={{ 
//               color: "#000935ff",
//               "&:hover": {
//                 bgcolor: "rgba(255,255,255,0.1)"
//               }
//             }}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Box>

//         <List sx={{ overflowY: "auto", flex: 1, py: 2 }}>
//           {drawerItems.map((item) => (
//             <ListItem key={item.label} disablePadding>
//               <ListItemButton
//                 selected={tab === item.tab}
//                 onClick={() => setTab(item.tab)}
//                 sx={{
//                   justifyContent: open ? "flex-start" : "center",
//                   px: open ? 2 : 1,
//                   my: 0.5,
//                   mx: open ? 1 : 0.5,
//                   borderRadius: "12px",
//                   color: "#09003fff",
//                   transition: "all 0.3s ease",
//                   "&.Mui-selected": {
//                     bgcolor: "rgba(172, 192, 241, 0.93)",
//                     backdropFilter: "blur(10px)",
//                     "&:hover": {
//                       bgcolor: "rgba(255,255,255,0.25)",
//                     }
//                   },
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.15)",
//                     transform: "translateX(4px)"
//                   }
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     minWidth: "auto",
//                     width: open ? 28 : "100%",
//                     mr: open ? 2 : 0,
//                     display: "flex",
//                     justifyContent: "center",
//                     color: "#002d47ff",
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>

//                 <ListItemText
//                   primary={item.label}
//                   sx={{ 
//                     opacity: open ? 1 : 0,
//                     "& .MuiTypography-root": {
//                       fontWeight: 600
//                     }
//                   }}
//                 />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>

//         {/* User Info at Bottom */}
//         {open && user && (
//           <Box sx={{ 
//             p: 2, 
//             borderTop: "1px solid rgba(255,255,255,0.2)",
//             background: "rgba(0,0,0,0.1)"
//           }}>
//             <Typography sx={{ 
//               color: "#12003bff", 
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               textAlign: "center"
//             }}>
//               {user.name || "User"}
//             </Typography>
//             <Typography sx={{ 
//               color: "rgba(1, 0, 70, 0.7)", 
//               fontSize: "0.75rem",
//               textAlign: "center"
//             }}>
//               {user.role || "Customer"}
//             </Typography>
//           </Box>
//         )}
//       </Drawer>

//       {/* Right Side */}
//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {/* Topbar */}
//         <Box
//           sx={{
//             height: 56,
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//             boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
//             background: "linear-gradient(150deg, #f3f5ffff 0%, #d6e6fdff 100%)",
//             backdropFilter: "blur(20px)",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: 3,
//             position: "sticky",
//             top: 0,
//             zIndex: 10,
//           }}
//         >
//           <Typography
//             variant="h5"
//             sx={{ 
//               fontWeight: 800, 
//               background: "linear-gradient(135deg, #000b3aff 0%, #437effff 100%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//               cursor: "pointer",
//               transition: "transform 0.2s ease",
//               "&:hover": {
//                 transform: "scale(1.05)"
//               }
//             }}
//             onClick={() => {
//               setTab(0);
//               setFilteredProducts([]);
//             }}
//           >
//              Store
//           </Typography>

//           <Box sx={{ display: "flex", gap: 1 }}>
//             <IconButton 
//               variant="contained"
//               onClick={() => setTab(4)} 
//               sx={{ 
//                 color: "#f82c2cff",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   bgcolor: "rgba(102, 126, 234, 0.1)",
//                   transform: "scale(1.1)"
//                 }
//               }}
//             >
//               <Badge 
//                 badgeContent={wishlistItems.length} 
//                 color="error" 
//                 showZero
//                 sx={{
//                   "& .MuiBadge-badge": {
//                     bgcolor: "#f82c2cff",
//                     fontWeight: 700
//                   }
//                 }}
//               >
//                 <FavoriteBorderIcon />
//               </Badge>
//             </IconButton>

//             <IconButton 
//               onClick={() => setTab(2)} 
//               sx={{ 
//                 color: "#7a02aaff",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   bgcolor: "rgba(102, 126, 234, 0.1)",
//                   transform: "scale(1.1)"
//                 }
//               }}
//             >
//               <Badge 
//                 badgeContent={cartItems.length}
//                 color="primary" 
//                 showZero
//                 sx={{
//                   "& .MuiBadge-badge": {
//                     bgcolor: "#7a02aaff",
//                     fontWeight: 700
//                   }
//                 }}
//               >
//                 <ShoppingCartIcon />
//               </Badge>
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Main Content */}
//         <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#f8f9fa" }}>
//           {tab === 0 && (
//             <CategoriesPage
//               onCategorySelect={(cat) => {
//                 const key = cat.key.toLowerCase();
//                 const filtered = productsData.filter(
//                   (p) => p.category.toLowerCase() === key
//                 );
//                 setFilteredProducts(filtered);
//               }}
//               onSwitchToProductsTab={switchToProductsTab}
//             />
//           )}

//           {tab === 1 && (
//             <ProductGrid
//               initialProducts={
//                 filteredProducts.length > 0 ? filteredProducts : productsData
//               }
//               cartItems={cartItems}
//               setCartItems={setCartItems}
//               wishlistItems={wishlistItems}
//               setWishlistItems={setWishlistItems}
//               userId={user?.id}
//               userRole={user?.role}
//             />
//           )}

//           {tab === 2 && (
//             <CartPage
//               setTab={setTab}
//               cartItems={cartItems}
//               setCartItems={setCartItems}
//               savedForLater={savedForLater}
//               setSavedForLater={setSavedForLater}
//             />
//           )}

//           {tab === 3 && <OrdersPage />}

//           {tab === 4 && (
//             <WishlistPage
//               userId={user?.id}
//               wishlistItems={wishlistItems}
//               setWishlistItems={setWishlistItems}
//               cartItems={cartItems}
//               setCartItems={setCartItems}
//             />
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// }



import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ImageIcon from '@mui/icons-material/Image';

import CategoriesPage from "./CategoriesPage";
import ProductGrid from "./components/ProductGrid";
import CartPage from "./CartPage";
import OrdersPage from "./OrderPage";
import WishlistPage from "./WishListPage";
import productsData from "./components/products.json";
import { getWishlistApi, getCartApi } from "../../api/api";
import ImageTestPage from "./components/ImageTestPage";
const drawerWidth = 220;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: "60px",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

const Drawer = styled("div")(({ theme, open }) => ({
  height: "100%",
  whiteSpace: "nowrap",
  flexShrink: 0,
  position: "sticky",
  top: 0,
  background: "linear-gradient(180deg, #f3f5ffff 0%, #a4c9ffff 100%)",
  borderRight: "none",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
}));

export default function EcommercePage() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [user, setUser] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const switchToProductsTab = () => {
    setTab(1);
  };

  // Load user on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Load wishlist + cart
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          // Fetch wishlist
          const wishlistRes = await getWishlistApi(user.id);
          if (Array.isArray(wishlistRes.data)) {
            const wishlistProducts = wishlistRes.data.map((item) => ({
              id: item.product_id,
              wishlist_id: item.id,
              name: item.product_name,
              image: item.image,
              price: item.product_price,
            }));
            setWishlistItems(wishlistProducts);
          }

          // Fetch cart and separate active cart from saved for later
          const cartRes = await getCartApi(user.id);
          if (Array.isArray(cartRes.data)) {
            const mapped = cartRes.data.map((r) => {
              const isSaved = r.is_saved === 1 || r.is_saved === true || r.is_saved === "1";
              
              return {
                id: r.cart_id || r.id,
                productId: r.product_id,
                name: r.name,
                price: Number(r.price),
                image: r.image,
                qty: Number(r.qty),
                rating: r.rating || r.rating_stars || 0,
                is_saved: isSaved,
              };
            });

            // Separate active cart items from saved for later
            const activeCart = mapped.filter((item) => !item.is_saved);
            const savedItems = mapped.filter((item) => item.is_saved);

            setCartItems(activeCart);
            setSavedForLater(savedItems);
          } else {
            setCartItems([]);
            setSavedForLater([]);
          }
        } catch (err) {
          console.error("Error loading data:", err);
        }
      }
    };
    loadData();
  }, [user]);

  const drawerItems = [
    { label: "Categories", tab: 0, icon: <CategoryIcon /> },
    { label: "Products", tab: 1, icon: <Inventory2Icon /> },
    { label: "Orders", tab: 3, icon: <AssignmentIcon /> },
    { label: "Image Upload", tab: 5, icon: <ImageIcon /> },

  ];

  return (
    <Box sx={{ height: "90vh", display: "flex", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer open={open}>
        <Box
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-end" : "center",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            background: "#f3f5ffff",
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          <IconButton 
            onClick={() => setOpen(!open)} 
            sx={{ 
              color: "#000935ff",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ overflowY: "auto", flex: 1, py: 2 }}>
          {drawerItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={tab === item.tab}
                onClick={() => setTab(item.tab)}
                sx={{
                  justifyContent: open ? "flex-start" : "center",
                  px: open ? 2 : 1,
                  my: 0.5,
                  mx: open ? 1 : 0.5,
                  borderRadius: "12px",
                  color: "#09003fff",
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    bgcolor: "rgba(172, 192, 241, 0.93)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.25)",
                    }
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.15)",
                    transform: "translateX(4px)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    width: open ? 28 : "100%",
                    mr: open ? 2 : 0,
                    display: "flex",
                    justifyContent: "center",
                    color: "#002d47ff",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  sx={{ 
                    opacity: open ? 1 : 0,
                    "& .MuiTypography-root": {
                      fontWeight: 600
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* User Info at Bottom */}
        {open && user && (
          <Box sx={{ 
            p: 2, 
            borderTop: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.1)"
          }}>
            <Typography sx={{ 
              color: "#12003bff", 
              fontSize: "0.875rem",
              fontWeight: 600,
              textAlign: "center"
            }}>
              {user.name || "User"}
            </Typography>
            <Typography sx={{ 
              color: "rgba(1, 0, 70, 0.7)", 
              fontSize: "0.75rem",
              textAlign: "center"
            }}>
              {user.role || "Customer"}
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Right Side */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <Box
          sx={{
            height: 56,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
            background: "linear-gradient(150deg, #f3f5ffff 0%, #d6e6fdff 100%)",
            backdropFilter: "blur(20px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Typography
            variant="h5"
            sx={{ 
              fontWeight: 800, 
              background: "linear-gradient(135deg, #000b3aff 0%, #437effff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)"
              }
            }}
            onClick={() => {
              setTab(0);
              setFilteredProducts([]);
            }}
          >
             Store
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton 
              variant="contained"
              onClick={() => setTab(4)} 
              sx={{ 
                color: "#f82c2cff",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  transform: "scale(1.1)"
                }
              }}
            >
              <Badge 
                badgeContent={wishlistItems.length} 
                color="error" 
                showZero
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#f82c2cff",
                    fontWeight: 700
                  }
                }}
              >
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>

            <IconButton 
              onClick={() => setTab(2)} 
              sx={{ 
                color: "#7a02aaff",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  transform: "scale(1.1)"
                }
              }}
            >
              <Badge 
                badgeContent={cartItems.length}
                color="primary" 
                showZero
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#7a02aaff",
                    fontWeight: 700
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#f8f9fa" }}>
          {tab === 0 && (
            <CategoriesPage
              onCategorySelect={(cat) => {
                const key = cat.key.toLowerCase();
                const filtered = productsData.filter(
                  (p) => p.category.toLowerCase() === key
                );
                setFilteredProducts(filtered);
              }}
              onSwitchToProductsTab={switchToProductsTab}
            />
          )}

          {tab === 1 && (
            <ProductGrid
              initialProducts={
                filteredProducts.length > 0 ? filteredProducts : productsData
              }
              cartItems={cartItems}
              setCartItems={setCartItems}
              wishlistItems={wishlistItems}
              setWishlistItems={setWishlistItems}
              userId={user?.id}
              userRole={user?.role}
            />
          )}

          {tab === 2 && (
            <CartPage
              setTab={setTab}
              cartItems={cartItems}
              setCartItems={setCartItems}
              savedForLater={savedForLater}
              setSavedForLater={setSavedForLater}
            />
          )}

          {tab === 3 && <OrdersPage />}

          {tab === 4 && (
            <WishlistPage
              userId={user?.id}
              wishlistItems={wishlistItems}
              setWishlistItems={setWishlistItems}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          )}
          {tab === 5 && <ImageTestPage />}

        </Box>
      </Box>
    </Box>
  );
}



