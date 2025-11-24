import React, { useState } from "react";
import { Box, Grid, Card, CardMedia, Typography } from "@mui/material";
import ProductGrid from "./components/ProductGrid";
import productsData from "./components/products.json";

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

 export default function CategoriesPage({ onCategorySelect, onSwitchToProductsTab }) {
  const categories = [
   
    { name: "Home & Furniture", image: "https://tse4.mm.bing.net/th/id/OIP.BZ52EBWgyaHg9vVGSMtZcQHaEF?rs=1&pid=ImgDetMain&o=7&rm=3", key: "home and furniture" },
    { name: "Makeup & Skincare", image: "https://katiecouric.com/wp-content/uploads/2022/06/Best-Clean-Beauty-Products-scaled.jpg", key: "makeup and skincare" },
    { name: "Health & Fitness", image: "https://thewritelife.com/wp-content/uploads/2016/07/health-magazines.jpg", key: "food and grocery" },
     { name: "Fashion", image: "https://www.thefashionisto.com/wp-content/uploads/2020/01/Couple-in-Denim-Fashions-900x600.jpg", key: "fashion" },
    { name: "Shoes", image: "https://image-cdn.hypb.st/https://hypebeast.com/image/2018/06/jordan-brand-fall-2018-preview-12.jpg?w=1260&format=jpeg&cbr=1&q=90&fit=max", key: "shoes" },
    { name: "Electronics", image: "https://img.freepik.com/free-photo/laptop-headphone-isolated-white_93675-71522.jpg?size=626&ext=jpg", key: "electronics" },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 5, bgcolor: "#e1e7f3ff"
 }}>
<Grid
  container
  spacing={3}
  justifyContent="center"
  sx={{
    maxWidth: 1100,
    margin: "0 auto",
  }}
>
  {categories.map((cat) => (
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
          maxWidth: 320,     // all cards same width
          height: 200,       // all cards same height
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
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
          }}
        />

        {/* Category Name Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            py: 2,
            background: "linear-gradient(0deg, rgba(0,0,0,0.7), transparent)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 700 }}
          >
            {cat.name}
          </Typography>
        </Box>
      </Card>
    </Grid>
  ))}
</Grid>


    </Box>
  );
}
