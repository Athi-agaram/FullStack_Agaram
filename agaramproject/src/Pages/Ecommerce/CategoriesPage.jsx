// import React, { useState } from "react";
// import { Box, Grid, Card, CardMedia, Typography } from "@mui/material";
// import ProductGrid from "./components/ProductGrid";
// import productsData from "./components/products.json";

// const mapCategory = (cat = "") => {
//   const c = cat.toLowerCase();
//   if (c.includes("electronics")) return "electronics";
//   if (c.includes("fashion")) return "fashion";
//   if (c.includes("shoe")) return "shoes";
//   if (c.includes("beauty") || c.includes("skincare") || c.includes("personal"))
//     return "makeup and skincare";
//   if (c.includes("home") || c.includes("kitchen")) return "home and furniture";
//   if (c.includes("health") || c.includes("fitness")) return "food and grocery";
//   return c.trim();
// };

//  export default function CategoriesPage({ onCategorySelect, onSwitchToProductsTab }) {
//   const categories = [
   
//     { name: "Home & Furniture", image: "https://tse4.mm.bing.net/th/id/OIP.BZ52EBWgyaHg9vVGSMtZcQHaEF?rs=1&pid=ImgDetMain&o=7&rm=3", key: "home and furniture" },
//     { name: "Makeup & Skincare", image: "https://katiecouric.com/wp-content/uploads/2022/06/Best-Clean-Beauty-Products-scaled.jpg", key: "makeup and skincare" },
//     { name: "Health & Fitness", image: "https://thewritelife.com/wp-content/uploads/2016/07/health-magazines.jpg", key: "food and grocery" },
//      { name: "Fashion", image: "https://www.thefashionisto.com/wp-content/uploads/2020/01/Couple-in-Denim-Fashions-900x600.jpg", key: "fashion" },
//     { name: "Shoes", image: "https://image-cdn.hypb.st/https://hypebeast.com/image/2018/06/jordan-brand-fall-2018-preview-12.jpg?w=1260&format=jpeg&cbr=1&q=90&fit=max", key: "shoes" },
//     { name: "Electronics", image: "https://img.freepik.com/free-photo/laptop-headphone-isolated-white_93675-71522.jpg?size=626&ext=jpg", key: "electronics" },
//   ];

//   return (
//     <Box sx={{ px: { xs: 2, md: 4 }, py: 5, background: "linear-gradient(135deg, #0f2844ff, #5c79a3ff, #a9c9f0ff)"

//  }}>
// <Grid
//   container
//   spacing={3}
//   justifyContent="center"
//   sx={{
//     maxWidth: 1100,
//     margin: "0 auto",
//   }}
// >
//   {categories.map((cat) => (
//     <Grid
//       item
//       xs={12}
//       sm={6}
//       md={4}
//       key={cat.key}
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Card
//         onClick={() => {
//           onCategorySelect(cat);
//           onSwitchToProductsTab();
//         }}
//         sx={{
//           cursor: "pointer",
//           width: "100%",
//           maxWidth: 320,     // all cards same width
//           height: 200,       // all cards same height
//           borderRadius: 3,
//           position: "relative",
//           overflow: "hidden",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           transition: "0.3s",
//           "&:hover": {
//             transform: "scale(1.05)",
//             boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
//           },
//         }}
//       >
//         <CardMedia
//           component="img"
//           image={cat.image}
//           alt={cat.name}
//           sx={{
//             height: "100%",
//             width: "100%",
//             objectFit: "cover",
//           }}
//         />

//         {/* Category Name Overlay */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 0,
//             width: "100%",
//             py: 2,
//             background: "linear-gradient(0deg, rgba(0,0,0,0.7), transparent)",
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{ color: "#fff", fontWeight: 700 }}
//           >
//             {cat.name}
//           </Typography>
//         </Box>
//       </Card>
//     </Grid>
//   ))}
// </Grid>


//     </Box>
//   );
// }



import React, { useState } from "react";
import { Box, Grid, Card, CardMedia, Typography, Chip } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export default function CategoriesPage({ onCategorySelect, onSwitchToProductsTab }) {
  const categories = [
    { 
      name: "Home & Furniture", 
      image: "https://tse4.mm.bing.net/th/id/OIP.BZ52EBWgyaHg9vVGSMtZcQHaEF?rs=1&pid=ImgDetMain&o=7&rm=3", 
      key: "home and furniture",
      badge: "New",
      color: "#FF6B6B"
    },
    { 
      name: "Makeup & Skincare", 
      image: "https://katiecouric.com/wp-content/uploads/2022/06/Best-Clean-Beauty-Products-scaled.jpg", 
      key: "makeup and skincare",
      badge: "Hot",
      color: "#FF69B4"
    },
    { 
      name: "Health & Fitness", 
      image: "https://thewritelife.com/wp-content/uploads/2016/07/health-magazines.jpg", 
      key: "food and grocery",
      badge: "Trending",
      color: "#4CAF50"
    },
    { 
      name: "Fashion", 
      image: "https://www.thefashionisto.com/wp-content/uploads/2020/01/Couple-in-Denim-Fashions-900x600.jpg", 
      key: "fashion",
      badge: "Popular",
      color: "#9C27B0"
    },
    { 
      name: "Shoes", 
      image: "https://image-cdn.hypb.st/https://hypebeast.com/image/2018/06/jordan-brand-fall-2018-preview-12.jpg?w=1260&format=jpeg&cbr=1&q=90&fit=max", 
      key: "shoes",
      badge: "Sale",
      color: "#FF9800"
    },
    { 
      name: "Electronics", 
      image: "https://img.freepik.com/free-photo/laptop-headphone-isolated-white_93675-71522.jpg?size=626&ext=jpg", 
      key: "electronics",
      badge: "Best Seller",
      color: "#2196F3"
    },
  ];

  return (
    <Box sx={{ 
      px: { xs: 2, md: 4 }, 
      py: 5, 
      background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        pointerEvents: "none"
      }
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: "center", 
        mb: 6,
        position: "relative",
        zIndex: 1
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 900, 
            color: "#fff",
            mb: 2,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            letterSpacing: "-1px",
            fontSize: { xs: "2.5rem", md: "3.5rem" }
          }}
        >
          Explore Categories
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: "rgba(255,255,255,0.9)",
            fontWeight: 400,
            maxWidth: 600,
            mx: "auto"
          }}
        >
          Discover amazing products across all your favorite categories
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}
      >
        {categories.map((cat, idx) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={cat.key}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              onClick={() => {
                onCategorySelect(cat);
                onSwitchToProductsTab();
              }}
              sx={{
                cursor: "pointer",
                width: "100%",
                maxWidth: 380,
                height: 240,
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "translateY(0)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${cat.color}20 0%, ${cat.color}40 100%)`,
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 1
                },
                "&:hover": {
                  transform: "translateY(-12px) scale(1.02)",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
                  "&::before": {
                    opacity: 1
                  },
                  "& .category-overlay": {
                    background: "linear-gradient(0deg, rgba(0,0,0,0.85), rgba(0,0,0,0.3))",
                    py: 3
                  },
                  "& .category-badge": {
                    transform: "scale(1.1) rotate(3deg)"
                  }
                },
              }}
            >
              <CardMedia
                component="img"
                image={cat.image}
                alt={cat.name}
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />

              {/* Badge */}
              <Chip
                label={cat.badge}
                icon={cat.badge === "Trending" ? <TrendingUpIcon /> : <LocalFireDepartmentIcon />}
                className="category-badge"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 3,
                  bgcolor: cat.color,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 28,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "transform 0.3s ease",
                  "& .MuiChip-icon": {
                    color: "#fff"
                  }
                }}
              />

              {/* Category Name Overlay */}
              <Box
                className="category-overlay"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  py: 2.5,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
                  textAlign: "center",
                  zIndex: 2,
                  transition: "all 0.4s ease",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ 
                    color: "#fff", 
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}
                >
                  {cat.name}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Decorative Elements */}
      <Box sx={{
        position: "absolute",
        bottom: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <Box sx={{
        position: "absolute",
        top: -150,
        right: -150,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
    </Box>
  );
}