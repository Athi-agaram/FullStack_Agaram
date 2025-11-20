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

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { styled } from "@mui/material/styles";

import CategoriesPage from "./CategoriesPage";
import ProductGrid from "./components/ProductGrid";
import CartPage from "./CartPage";
import OrdersPage from "./OrderPage";
import WishlistPage from "./WishListPage";
import productsData from "./components/products.json";

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
  height: "100vh",
  whiteSpace: "nowrap",
  flexShrink: 0,
  background: "#f5f8ff",
  borderRight: "1px solid #d4ddf0",
  margin: 0,
  padding: 0,
  overflowY: "hidden",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
}));

export default function EcommercePage({ topOffset = 56 }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0); // 0: Categories, 1: Products, 2: Cart, 3: Orders, 4: Wishlist
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Initialize cart & wishlist with unique cart_id
  const [cartItems, setCartItems] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    return stored.map(item => ({ ...item, cart_id: item.cart_id || Date.now() + Math.random() }));
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    return stored.map(item => ({ ...item, cart_id: item.cart_id || Date.now() + Math.random() }));
  });

  const drawerItems = [
    { label: "Categories", tab: 0, icon: <CategoryIcon /> },
    { label: "Products", tab: 1, icon: <Inventory2Icon /> },
    { label: "Orders", tab: 3, icon: <AssignmentIcon /> },
  ];

  const mapCategory = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("electronics")) return "electronics";
    if (c.includes("fashion")) return "fashion";
    if (c.includes("shoe")) return "shoes";
    if (c.includes("beauty") || c.includes("skincare") || c.includes("personal"))
      return "makeup and skincare";
    if (c.includes("home") || c.includes("kitchen")) return "home and furniture";
    if (c.includes("health") || c.includes("fitness")) return "food and grocery";
    return c.trim();
  };

  // Sync localStorage when cart/wishlist changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  return (
    <Box sx={{ height: "100vh", display: "flex", m: 0, p: 0 }}>
      <CssBaseline />

      {/* Drawer */}
      <Drawer open={open}>
        <Box
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-end" : "center",
            borderBottom: "1px solid #d4ddf0",
          }}
        >
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "#1e2a47" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ height: "100%", p: 0 }}>
          {drawerItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={tab === item.tab}
                onClick={() => setTab(item.tab)}
                sx={{
                  justifyContent: open ? "flex-start" : "center",
                  px: open ? 2 : 1,
                  my: "4px",
                  borderRadius: "8px",
                  marginX: open ? "8px" : "0px",
                  transition: "0.25s",
                  "&:hover": { backgroundColor: "#EEF4FF" },
                  "&.Mui-selected": { backgroundColor: "#DBE7FF", fontWeight: 700 },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    display: "flex",
                    justifyContent: "center",
                    width: open ? 28 : "100%",
                    mr: open ? 2 : 0,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  sx={{ opacity: open ? 1 : 0, transition: "0.2s" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1, position: "relative", bgcolor: "#ffffffff", pt: 0 }}>
        {/* STORE TOPBAR */}
        <Box
          sx={{
            height: 56,
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1e2a47", cursor: "pointer" }}
            onClick={() => {
              setTab(0);
              setFilteredProducts([]);
            }}
          >
            Store
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={() => setTab(4)} sx={{ color: "#1e2a47" }}>
              <Badge badgeContent={wishlistItems.length} color="primary" showZero>
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={() => setTab(2)} sx={{ color: "#1e2a47" }}>
              <Badge badgeContent={cartItems.length} color="primary" showZero>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* CONTENT BELOW STORE TOPBAR */}
        <Box
          sx={{
            mt: 0,
            height: `calc(100vh - ${topOffset}px)`,
            overflowY: "auto",
            p: 0,
            background: "rgba(255,255,255,0.0)",
          }}
        >
          {tab === 0 && (
            <CategoriesPage
              onCategorySelect={(cat) => {
                const key = mapCategory(cat.key);
                const filtered = productsData.filter(
                  (p) => mapCategory(p.category) === key
                );
                setFilteredProducts(filtered);
              }}
              onSwitchToProductsTab={() => setTab(1)}
            />
          )}

          {tab === 1 && (
            <ProductGrid
              initialProducts={filteredProducts.length > 0 ? filteredProducts : productsData}
              cartItems={cartItems}
              setCartItems={setCartItems}
              wishlistItems={wishlistItems}
              setWishlistItems={setWishlistItems}
            />
          )}

          {tab === 2 && (
            <CartPage
              setTab={setTab}
              cartItems={cartItems}
              setCartItems={setCartItems}
              wishlistItems={wishlistItems}
              setWishlistItems={setWishlistItems}
            />
          )}

          {tab === 3 && <OrdersPage />}

          {tab === 4 && (
            <WishlistPage
              wishlistItems={wishlistItems}
              setWishlistItems={setWishlistItems}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
