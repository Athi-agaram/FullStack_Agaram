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

export default function CategoriesPage() {
  const categories = [
    { name: "Fashion", image: "https://www.thefashionisto.com/wp-content/uploads/2020/01/Couple-in-Denim-Fashions-900x600.jpg", key: "fashion" },
    { name: "Shoes", image: "https://image-cdn.hypb.st/https://hypebeast.com/image/2018/06/jordan-brand-fall-2018-preview-12.jpg?w=1260&format=jpeg&cbr=1&q=90&fit=max", key: "shoes" },
    { name: "Electronics", image: "https://img.freepik.com/free-photo/laptop-headphone-isolated-white_93675-71522.jpg?size=626&ext=jpg", key: "electronics" },
    { name: "Home & Furniture", image: "https://tse4.mm.bing.net/th/id/OIP.BZ52EBWgyaHg9vVGSMtZcQHaEF?rs=1&pid=ImgDetMain&o=7&rm=3", key: "home and furniture" },
    { name: "Makeup & Skincare", image: "https://katiecouric.com/wp-content/uploads/2022/06/Best-Clean-Beauty-Products-scaled.jpg", key: "makeup and skincare" },
    { name: "Health and Fitness", image: "https://thewritelife.com/wp-content/uploads/2016/07/health-magazines.jpg", key: "food and grocery" }
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const filteredProducts = selectedCategory
    ? productsData.filter((p) => mapCategory(p.category) === selectedCategory.key)
    : [];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "#f3f6f9" }}>
      {!selectedCategory ? (
        <Grid container spacing={3} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.key}>
              <Card
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: 200,
                  width: "100%",
                  position: "relative",
                  backgroundColor: "#fff",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    py: 1.5,
                    bgcolor: "rgba(0,0,0,0.5)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight={600} color="#fff">
                    {cat.name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Categories
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            {selectedCategory.name}
          </Typography>

          <ProductGrid initialProducts={filteredProducts} />
        </>
      )}
    </Box>
  );
}
