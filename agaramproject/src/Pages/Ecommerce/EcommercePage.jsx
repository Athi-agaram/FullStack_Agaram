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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CategoriesPage from "./CategoriesPage";
import ProductGrid from "./components/ProductGrid";
import CartPage from "./CartPage";
import OrdersPage from "./OrderPage";
import WishlistPage from "./WishListPage";
import productsData from "./components/products.json";
import { getWishlistApi, getCartApi } from "../../api/api";

import { useNavigate } from "react-router-dom";
import { Popper, ClickAwayListener, Paper, MenuList, MenuItem, Divider } from "@mui/material";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Initialize user directly from localStorage
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const switchToProductsTab = () => setTab(1);

  // Load wishlist + cart when user is ready
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          const wishlistRes = await getWishlistApi(user.id);
          if (Array.isArray(wishlistRes.data)) {
            setWishlistItems(
              wishlistRes.data.map((item) => ({
                id: item.product_id,
                wishlist_id: item.id,
                name: item.product_name,
                image: item.image,
                price: item.product_price,
              }))
            );
          }

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
            setCartItems(mapped.filter((item) => !item.is_saved));
            setSavedForLater(mapped.filter((item) => item.is_saved));
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
    { label: "Dashboard", tab: -1, icon: <ArrowBackIcon /> },
    { label: "Categories", tab: 0, icon: <CategoryIcon /> },
    { label: "Products", tab: 1, icon: <Inventory2Icon /> },
    { label: "Orders", tab: 3, icon: <AssignmentIcon /> },
    {label:"Logout", tab: -2, icon:<LogoutSharpIcon />}
  ];
const [anchorEl, setAnchorEl] = useState(null);
const openDropdown = Boolean(anchorEl);
const handleClick = (event) => setAnchorEl(event.currentTarget);
const handleCloseMenu = () => setAnchorEl(null);

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  navigate("/");
};
  return (
    <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      <CssBaseline />

      {/* Drawer */}
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
            sx={{ color: "#000935ff", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ overflowY: "auto", flex: 1, py: 2 }}>
          {drawerItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
  selected={tab === item.tab}
  onClick={() => {
    if (item.tab === -1) {
      navigate("/home"); // Back to dashboard
    } else if (item.tab === -2) { 
      // Logout
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      }
    } else {
      setTab(item.tab);
    }
  }}
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
      "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
    },
    "&:hover": { bgcolor: "rgba(255,255,255,0.15)", transform: "translateX(4px)" },
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
    sx={{ opacity: open ? 1 : 0, "& .MuiTypography-root": { fontWeight: 600 } }}
  />
</ListItemButton>

            </ListItem>
          ))}
        </List>

        {open && user && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              sx={{ color: "#12003bff", fontSize: "0.875rem", fontWeight: 600, textAlign: "center" }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={{ color: "rgba(1, 0, 70, 0.7)", fontSize: "0.75rem", textAlign: "center" }}
            >
              {user.role || "Customer"}
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
{/* Topbar */}

{user && (
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
    {/* Store Title */}
    <Typography
      variant="h5"
      sx={{
        fontWeight: 800,
        background: "linear-gradient(135deg, #000b3aff 0%, #437effff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        cursor: "pointer",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.05)" },
      }}
      onClick={() => {
        setTab(0);
        setFilteredProducts([]);
        setSelectedCategory("");
      }}
    >
      Store
    </Typography>

    {/* User Info + Icons */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {/* User Name & Role (like Agaram top bar) */}
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#000b3a" }}>
      {user.username}
    </Typography>
    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
      {user.role || "Customer"}
    </Typography>
  </Box>


      {/* Wishlist & Cart */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => setTab(4)}
          sx={{
            color: "#f82c2cff",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(102,126,234,0.1)", transform: "scale(1.1)" },
          }}
        >
          <Badge
            badgeContent={wishlistItems.length}
            color="error"
            showZero
            sx={{ "& .MuiBadge-badge": { bgcolor: "#f82c2cff", fontWeight: 700 } }}
          >
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>

        <IconButton
          onClick={() => setTab(2)}
          sx={{
            color: "#7a02aaff",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(102,126,234,0.1)", transform: "scale(1.1)" },
          }}
        >
          <Badge
            badgeContent={cartItems.length}
            color="primary"
            showZero
            sx={{ "& .MuiBadge-badge": { bgcolor: "#7a02aaff", fontWeight: 700 } }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>


</Box>
    </Box>

)}


        {/* Main Tab Content */}
        <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#f8f9fa" }}>
          {tab === 0 && (
            <CategoriesPage
              onCategorySelect={(categoryId) => {
                setSelectedCategory(categoryId);
                setFilteredProducts(
                  productsData.filter((p) => Number(p.category_id) === Number(categoryId))
                );
                switchToProductsTab();
              }}
              onSwitchToProductsTab={switchToProductsTab}
            />
          )}
          {tab === 1 && (
            <ProductGrid
              selectedCategoryFromCategoryPage={selectedCategory}
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
        </Box>
      </Box>
    </Box>
  );
}
