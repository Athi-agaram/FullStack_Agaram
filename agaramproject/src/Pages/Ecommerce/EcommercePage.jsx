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

/* ---- Drawer Styles ---- */
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

/* ---- FIXED: Drawer stays sticky & matches topbar ---- */
const Drawer = styled("div")(({ theme, open }) => ({
  height: "100%",                   // FIXED
  whiteSpace: "nowrap",
  flexShrink: 0,
  position: "sticky",
  top: 0,
  background: "#f5f8ff",
  borderRight: "1px solid #d4ddf0",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
}));

export default function EcommercePage() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    return stored.map((item) => ({
      ...item,
      cart_id: item.cart_id || crypto.randomUUID(),
    }));
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    return stored.map((item) => ({
      ...item,
      cart_id: item.cart_id || crypto.randomUUID(),
    }));
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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      {/* ---- SIDEBAR ---- */}
      <Drawer open={open}>
        <Box
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-end" : "center",
            borderBottom: "1px solid #d4ddf0",
            position: "sticky",
            top: 0,
            background: "#f5f8ff",
            zIndex: 10,
          }}
        >
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "#1e2a47" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ overflowY: "auto", flex: 1 }}>
          {drawerItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={tab === item.tab}
                onClick={() => setTab(item.tab)}
                sx={{
                  justifyContent: open ? "flex-start" : "center",
                  px: open ? 2 : 1,
                  my: 0.5,
                  mx: open ? 1 : 0,
                  borderRadius: "8px",
                  transition: "0.25s",
                  "&:hover": { backgroundColor: "#EEF4FF" },
                  "&.Mui-selected": {
                    backgroundColor: "#DBE7FF",
                    fontWeight: 700,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    width: open ? 28 : "100%",
                    mr: open ? 2 : 0,
                    display: "flex",
                    justifyContent: "center",
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

      {/* ---- RIGHT SIDE ---- */}
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ---- TOPBAR (STICKY FIXED) ---- */}
        <Box
          sx={{
            height: 56,
            borderBottom: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(22px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            position: "sticky",
            top: 0,
            zIndex: 20,
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

        {/* ---- SCROLLABLE MAIN CONTENT ---- */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
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
              initialProducts={
                filteredProducts.length > 0 ? filteredProducts : productsData
              }
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
