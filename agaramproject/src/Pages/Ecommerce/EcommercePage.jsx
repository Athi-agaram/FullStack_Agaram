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
  Popper,
  ClickAwayListener,
  Paper,
  MenuList,
  MenuItem,
  Divider,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";

import CategoriesPage from "./CategoriesPage";
import ProductGrid from "./components/ProductGrid";
import CartPage from "./CartPage";
import OrdersPage from "./OrderPage";
import WishlistPage from "./WishListPage";
import productsData from "./components/products.json";
import { getWishlistApi, getCartApi } from "../../api/api";

import { useNavigate } from "react-router-dom";

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

const DrawerBox = styled(Box)(({ theme, open }) => ({
  whiteSpace: "nowrap",
  flexShrink: 0,
  background: "linear-gradient(180deg, #f3f5ffff 0%, #a4c9ffff 100%)",
  borderRight: "none",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
}));

export default function EcommercePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const switchToProductsTab = () => setTab(1);

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
    { label: "Logout", tab: -2, icon: <LogoutSharpIcon /> },
  ];

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const moreOpen = Boolean(moreAnchorEl);
  const handleMoreClick = (e) => setMoreAnchorEl(e.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: {xs:"100vh",md:"100vh"},
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflowY: "hidden",
      }}
    >
      <CssBaseline />

      {/* Desktop Sidebar - Sticky */}
      {isMdUp && (
        <DrawerBox
          open={open}
          sx={{
            position: "sticky",
            top: 0,
            height: "100vh",
            alignSelf: "flex-start",
          }}
        >
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
              px: 1,
            }}
          >
            <IconButton
              onClick={() => setOpen((s) => !s)}
              sx={{ color: "#000935ff", "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <List sx={{ overflowY: "hidden", flex: 1, py: 2 }}>
            {drawerItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  selected={tab === item.tab}
                  onClick={() => {
                    if (item.tab === -1) {
                      navigate("/home");
                    } else if (item.tab === -2) {
                      const confirmed = window.confirm("Are you sure you want to logout?");
                      if (confirmed) handleLogout();
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
                background: "rgba(0,0,0,0.03)",
              }}
            >
              <Typography
                sx={{ color: "#12003bff", fontSize: "0.875rem", fontWeight: 600, textAlign: "center" }}
              >
                {user.name}
              </Typography>
              <Typography sx={{ color: "rgba(1, 0, 70, 0.7)", fontSize: "0.75rem", textAlign: "center" }}>
                {user.role || "Customer"}
              </Typography>
            </Box>
          )}
        </DrawerBox>
      )}

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Sticky Topbar */}
        <Box
          sx={{
            height: 56,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
            background: "linear-gradient(150deg, #f3f5ffff 0%, #d6e6fdff 100%)",
            backdropFilter: "blur(20px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            position: "sticky",
            top: 0,
            zIndex: 1200,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMdUp && (
              <>
                <IconButton onClick={handleMoreClick} aria-label="more">
                  <MenuIcon />
                </IconButton>
                <Popper open={moreOpen} anchorEl={moreAnchorEl} placement="bottom-start" transition>
                  {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleMoreClose}>
                      <Paper sx={{ mt: 1 }}>
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              handleMoreClose();
                              navigate("/home");
                            }}
                          >
                            Dashboard
                          </MenuItem>
                          <MenuItem
                          
                            onClick={() => {
                              handleMoreClose();
                              const confirmed = window.confirm("Logout?");
                              if (confirmed) handleLogout();
                            }}
                          >
                            Logout
                          </MenuItem>
                        </MenuList>
                      </Paper>
                    </ClickAwayListener>
                  )}
                </Popper>
              </>
            )}

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #000b3aff 0%, #437effff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
              onClick={() => {
                setTab(0);
                setFilteredProducts([]);
                setSelectedCategory("");
              }}
            >
              Store
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", textAlign: "right" }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#000b3a" }}>
                {user?.username}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>{user?.role || "Customer"}</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Wishlist">
                <IconButton
                  onClick={() => setTab(4)}
                  sx={{
                    color: "#f82c2cff",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "rgba(102,126,234,0.08)", transform: "scale(1.05)" },
                  }}
                >
                  <Badge badgeContent={wishlistItems.length} color="error" showZero>
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton
                  onClick={() => setTab(2)}
                  sx={{
                    color: "#7a02aaff",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "rgba(102,126,234,0.08)", transform: "scale(1.05)" },
                  }}
                >
                  <Badge badgeContent={cartItems.length} color="primary" showZero>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Scrollable Content Area */}
<Box
  sx={{
    flex: 1,
    overflowY: "auto",
    pb: { xs: "76px", md: 0 },

    "&::-webkit-scrollbar": {
      width: "0px",
    },

  }}
>

          {tab === 0 && (
            <CategoriesPage
              onCategorySelect={(categoryId) => {
                setSelectedCategory(categoryId);
                setFilteredProducts(productsData.filter((p) => Number(p.category_id) === Number(categoryId)));
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

      {/* Mobile Bottom Navigation */}
      {!isMdUp && (
        <Box
          component="nav"
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            bgcolor: "background.paper",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 1400,
            px: 1,
            boxShadow: "0 -6px 18px rgba(0,0,0,0.06)",
          }}
        >
          {drawerItems.map((it) => {
            if (it.tab === -1) return null;
            return (
              <Box
                key={it.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 56,
                  textAlign: "center",
                }}
              >
                <IconButton
                  onClick={() => {
                    if (it.tab === -2) {
                      const confirmed = window.confirm("Logout?");
                      if (confirmed) handleLogout();
                    } else {
                      setTab(it.tab);
                    }
                  }}
                  sx={{
                    p: 0.5,
                    color: tab === it.tab ? "primary.main" : "text.secondary",
                    
                  }}
                >
                  <Badge 
                    badgeContent={it.tab === 4 ? wishlistItems.length : it.tab === 2 ? cartItems.length : 0} 
                    color="error"
                  >
                    {it.icon}
                  </Badge>
                </IconButton>
                <Typography sx={{ fontSize: 11, mt: 0.25, color: tab === it.tab ? "primary.main" : "text.secondary" }}>
                  {it.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}