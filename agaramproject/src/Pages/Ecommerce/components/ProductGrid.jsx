
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   InputAdornment,
//   Paper,
//   Skeleton,
//   Rating,
//   Modal,
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";

// import {
//   addToCartApi,
//   addWishlistApi,
//   removeWishlistApi,
//   addStoreProduct,
// } from "../../../api/api";

// // ⭐ CATEGORY LIST
// const categoryOptions = [
//   { name: "Electronics and gadgets", key: "electronics", id: 1 },
//   { name: "Beauty & Personal Care", key: "beauty", id: 2 },
//   { name: "Fashion & Apparel", key: "fashion", id: 3 },
//   { name: "Home & Kitchen", key: "home", id: 4 },
//   { name: "Health & Fitness", key: "health", id: 5 },
//   { name: "Shoes", key: "shoes", id: 6 },
// ];

// export default function ProductGrid({
//   cartItems,
//   setCartItems,
//   wishlistItems,
//   setWishlistItems,
//   userId,
//   userRole,
// }) {
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [sortType, setSortType] = useState("none");

//   // ⭐ MODAL STATES
//   const [openModal, setOpenModal] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     price: 0,
//     category: "",
//     subcategory: "",
//     image: "",
//     rating_stars: 4.5,
//     rating_count: 10,
//     description: "",
//     keywords: "",
//     stock: 0,
//     category_id: 1,
//   });

//   // --------------------------
//   // NORMALIZE PRODUCTS
//   // --------------------------
//   const normalizeProducts = (arr) =>
//     arr.map((p) => ({
//       id: p.id,
//       name: p.name,
//       price: Number(p.price),
//       category: p.category || "general",
//       image: p.image,
//       rating: Number(p.rating_stars) || 4,
//       reviews: Number(p.rating_count) || 20,
//       keywords: typeof p.keywords === "string" ? p.keywords.split(",") : [],
//       stock: Number(p.stock) || 0,
//       category_id: Number(p.category_id) || 1,
//     }));

//   // --------------------------
//   // LOAD PRODUCTS FROM BACKEND
//   // --------------------------
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8098/api/storeproducts");
//       const data = await res.json();
//       const list = normalizeProducts(data);
//       setProducts(list);
//       setFiltered(list);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Only use the main 6 categories for filter dropdown
//   const categoryList = ["all", ...categoryOptions.map((c) => c.name)];

//   // --------------------------
//   // FILTER + SORT
//   // --------------------------
//   useEffect(() => {
//     let list = [...products];

//     if (search.trim() !== "") {
//       const s = search.toLowerCase();
//       list = list.filter(
//         (p) =>
//           p.name.toLowerCase().includes(s) ||
//           p.keywords.some((k) => k.toLowerCase().includes(s))
//       );
//     }

//     if (selectedCategory !== "all") {
//       list = list.filter((p) => p.category === selectedCategory);
//     }

//     if (sortType === "low-high") list.sort((a, b) => a.price - b.price);
//     if (sortType === "high-low") list.sort((a, b) => b.price - a.price);

//     setFiltered(list);
//   }, [search, selectedCategory, sortType, products]);

//   // --------------------------
//   // WISHLIST TOGGLE
//   // --------------------------
//   const toggleWishlist = async (p) => {
//     if (!userId) return alert("Login required");

//     const exists = wishlistItems.find((x) => x.id === p.id);

//     try {
//       if (exists) {
//         await removeWishlistApi(userId, exists.wishlist_id);
//         setWishlistItems(wishlistItems.filter((x) => x.id !== p.id));
//       } else {
//         const res = await addWishlistApi(userId, p.id, 1);
//         setWishlistItems([
//           ...wishlistItems,
//           {
//             id: p.id,
//             wishlist_id: res.data?.id,
//             name: p.name,
//             price: p.price,
//             image: p.image,
//           },
//         ]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // --------------------------
//   // ADD TO CART
//   // --------------------------
//   const handleAddToCart = async (product) => {
//     try {
//       if (!userId) return alert("Login required");

//       await addToCartApi({ userId, productId: product.id, qty: 1 });

//       const updated = await fetch(`http://localhost:8098/api/cart/${userId}`).then(
//         (res) => res.json()
//       );

//       setCartItems(updated);

//       alert("Added to cart!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // --------------------------
//   // SAVE NEW PRODUCT
//   // --------------------------
//   const handleSaveProduct = async () => {
//     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
//       return alert("Please fill Name, Price, Image URL, and Category");
//     }

//     try {
//       // ⭐ Map category name to category_id
//       const categoryObj = categoryOptions.find(
//         (c) => c.name === newProduct.category
//       );

//       if (!categoryObj) return alert("Invalid category selected");

//       const payload = {
//         name: newProduct.name,
//         price: Number(newProduct.price),
//         category: categoryObj.name,
//         subcategory: newProduct.subcategory || "",
//         image: newProduct.image,
//         ratingStars: Number(newProduct.rating_stars),
//         ratingCount: Number(newProduct.rating_count),
//         description: newProduct.description || "",
//         keywords: newProduct.keywords || "",
//         stock: Number(newProduct.stock || 0),
//         category_id: categoryObj.id, // ✅ FK-safe
//       };

//       const res = await addStoreProduct(payload);

//       if (!res.ok) throw new Error("Backend error");

//       alert("Product added!");
//       fetchProducts();
//       setOpenModal(false);
//       setNewProduct({
//         name: "",
//         price: 0,
//         category: "",
//         subcategory: "",
//         image: "",
//         rating_stars: 4.5,
//         rating_count: 10,
//         description: "",
//         keywords: "",
//         stock: 0,
//         category_id: 1,
//       });
//     } catch (err) {
//       console.error("Failed to add product:", err);
//       alert("Failed to add product: " + err.message);
//     }
//   };

//   return (
//     <Box sx={{ height: "1300%", overflow: "visible" ,background: "linear-gradient(135deg, #0f2844ff, #5c79a3ff, #a9c9f0ff)"}}>
//        {/* FILTER BAR */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 2,
//           position: "sticky",
//           mb: 3,
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 2,
//           alignItems: "center",
//           bgcolor:"#012146ff",
//           borderRadius:0
//         }}
//       >
//         <TextField
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{
//             flex: 1,
//             minWidth: 300,
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "25px",
//               backgroundColor: "#fff",
//               height: 50,
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           select
//           label="Category"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           sx={{ width: 200, bgcolor: "#fff",    "& .MuiInputLabel-shrink": {
//       color: "#00013fff !important",
//       bgcolor: "rgba(236, 231, 255, 1)",
//       fontSize: "20px",
//       borderRadius: "5px !important",
//       paddingLeft: "4px",
//       paddingRight: "4px",
//       border:1,
//     },}}
//         >
//           {categoryList.map((c) => (
//             <MenuItem key={c} value={c}>
//               {c}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           select
//           label="Sort"
//           value={sortType}
//           onChange={(e) => setSortType(e.target.value)}
//           sx={{ width: 200, bgcolor: "#fff",    "& .MuiInputLabel-shrink": {
//       color: "#000130ff !important",
//       bgcolor: "rgba(236, 231, 255, 1)",
//       fontSize: "20px",
//       borderRadius: "5px !important",
//       paddingLeft: "4px",
//       paddingRight: "4px",
//       border:1,

//     },}}

//         >
//           <MenuItem value="none">None</MenuItem>
//           <MenuItem value="low-high">Low to High</MenuItem>
//           <MenuItem value="high-low">High to Low</MenuItem>
//         </TextField>

//         {userRole === "ADMIN" && (
//           <Button variant="contained" onClick={() => setOpenModal(true)}
//           sx={{fontWeight:"bold",bgcolor:"#aec2faff",height:"55px",color:"#030029ff", "&:hover":{bgcolor:"#406ce6ff"}}}
//           >
//             Add Product
//           </Button>
//         )}
//       </Paper>

//       {/* PRODUCT GRID */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//           gap: 1,
//           margin: 1,
//           borderRadius: 4
//         }}
//       >
//         {loading
//           ? Array.from(new Array(8)).map((_, i) => (
//               <Card key={i}>
//                 <Skeleton variant="rectangular" height={160} />
//                 <CardContent sx={{}}>
//                   <Skeleton height={30} width="70%" />
//                   <Skeleton height={20} width="40%" />
//                 </CardContent>
//               </Card>
//             ))
//           : filtered.map((p) => (
//               <Card key={p.id} sx={{borderRadius:4}}>
//                 <CardMedia
//                   component="img"
//                   image={p.image}
//                   sx={{ height: 150, objectFit: "contain",padding:1 }}
//                 />
//                 <CardContent sx={{ textAlign: "center",p:3 ,bgcolor:"#f5f5f5"}}>
//                   <Typography fontWeight="bold">{p.name}</Typography>
//                   <Rating value={p.rating} readOnly size="small" />
//                   <Typography sx={{ color: "green" }}>₹{p.price}</Typography>

//                   <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                    <Button
//                       variant="outlined"
//                       sx={{ minWidth: 50, width: 50, height: 50, p: 0, borderRadius: 2,border:"none" }}
//                       onClick={() => toggleWishlist(p)}
//                     >
//                       {wishlistItems.find((x) => x.id === p.id) ? (
//                         <FavoriteIcon sx={{ fontSize: 35, color: "#001f75ff" }} />
//                       ) : (
//                         <FavoriteBorderIcon sx={{ fontSize: 35 }} />
//                       )}
//                     </Button>

//                     <Button
//                       variant="contained"
//                       fullWidth
//                       onClick={() => handleAddToCart(p)}
//                       sx={{fontWeight:"bold",bgcolor:"#001f75ff", "&:hover":{bgcolor:"#406ce6ff"}}}
//                     >
//                       Add
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))}
//       </Box>

//       {/* ⭐ ADD PRODUCT MODAL ⭐ */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box
//           sx={{
//             width: 420,
//             background: "white",
//             p: 3,
//             borderRadius: 3,
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//           }}
//         >
//           <Typography variant="h6">Add New Product</Typography>

//           <TextField
//             fullWidth
//             label="Product Name"
//             sx={{ mt: 2 }}
//             value={newProduct.name}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, name: e.target.value })
//             }
//           />

//           <TextField
//             fullWidth
//             label="Price"
//             type="number"
//             sx={{ mt: 2 }}
//             value={newProduct.price}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, price: e.target.value })
//             }
//           />

//           <TextField
//             fullWidth
//             select
//             label="Category"
//             sx={{ mt: 2 }}
//             value={newProduct.category}
//             onChange={(e) => {
//               const selected = categoryOptions.find(c => c.name === e.target.value);
//               setNewProduct({
//                 ...newProduct,
//                 category: e.target.value,
//                 category_id: selected?.id || 1
//               });
//             }}
//           >
//             {categoryOptions.map((c) => (
//               <MenuItem key={c.key} value={c.name}>
//                 {c.name}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             fullWidth
//             label="Rating Stars"
//             type="number"
//             sx={{ mt: 2 }}
//             inputProps={{ step: "0.1", min: 0, max: 5 }}
//             value={newProduct.rating_stars}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, rating_stars: e.target.value })
//             }
//           />

//           <TextField
//             fullWidth
//             label="Rating Count"
//             type="number"
//             sx={{ mt: 2 }}
//             value={newProduct.rating_count}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, rating_count: e.target.value })
//             }
//           />

//           <TextField
//             fullWidth
//             label="Image URL"
//             placeholder="http://localhost:8098/product-images/201.jpg"
//             sx={{ mt: 2 }}
//             value={newProduct.image}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, image: e.target.value })
//             }
//           />

//           <TextField
//             fullWidth
//             label="Stock"
//             type="number"
//             sx={{ mt: 2 }}
//             value={newProduct.stock}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, stock: e.target.value })
//             }
//           />

//           <Button
//             variant="contained"
//             fullWidth
//             sx={{ mt: 3 }}
//             onClick={handleSaveProduct}
//           >
//             Save Product
//           </Button>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Skeleton,
  Rating,
  Modal,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import {
  addToCartApi,
  addWishlistApi,
  removeWishlistApi,
  addStoreProduct,
} from "../../../api/api";

// ⭐ CATEGORY LIST
const categoryOptions = [
  { name: "Electronics and gadgets", key: "electronics", id: 1 },
  { name: "Beauty & Personal Care", key: "beauty", id: 2 },
  { name: "Fashion & Apparel", key: "fashion", id: 3 },
  { name: "Home & Kitchen", key: "home", id: 4 },
  { name: "Health & Fitness", key: "health", id: 5 },
  { name: "Shoes", key: "shoes", id: 6 },
];

export default function ProductGrid({
  cartItems,
  setCartItems,
  wishlistItems,
  setWishlistItems,
  userId,
  userRole,
}) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState("none");

  // ⭐ MODAL STATES
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: "",
    subcategory: "",
    image: "",
    rating_stars: 4.5,
    rating_count: 10,
    description: "",
    keywords: "",
    stock: 0,
    category_id: 1,
  });

  // --------------------------
  // NORMALIZE PRODUCTS
  // --------------------------
  const normalizeProducts = (arr) =>
    arr.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.category || "general",
      image: p.image,
      rating: Number(p.rating_stars) || 4,
      reviews: Number(p.rating_count) || 20,
      keywords: typeof p.keywords === "string" ? p.keywords.split(",") : [],
      stock: Number(p.stock) || 0,
      category_id: Number(p.category_id) || 1,
    }));

  // --------------------------
  // LOAD PRODUCTS FROM BACKEND
  // --------------------------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8098/api/storeproducts");
      const data = await res.json();
      const list = normalizeProducts(data);
      setProducts(list);
      setFiltered(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Only use the main 6 categories for filter dropdown
  const categoryList = ["all", ...categoryOptions.map((c) => c.name)];

  // --------------------------
  // FILTER + SORT
  // --------------------------
  useEffect(() => {
    let list = [...products];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.keywords.some((k) => k.toLowerCase().includes(s))
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortType === "low-high") list.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
  }, [search, selectedCategory, sortType, products]);

  // --------------------------
  // WISHLIST TOGGLE
  // --------------------------
  const toggleWishlist = async (p) => {
    if (!userId) return alert("Login required");

    const exists = wishlistItems.find((x) => x.id === p.id);

    try {
      if (exists) {
        await removeWishlistApi(userId, exists.wishlist_id);
        setWishlistItems(wishlistItems.filter((x) => x.id !== p.id));
      } else {
        const res = await addWishlistApi(userId, p.id, 1);
        setWishlistItems([
          ...wishlistItems,
          {
            id: p.id,
            wishlist_id: res.data?.id,
            name: p.name,
            price: p.price,
            image: p.image,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------
  // ADD TO CART
  // --------------------------
  const handleAddToCart = async (product) => {
    try {
      if (!userId) return alert("Login required");

      await addToCartApi({ userId, productId: product.id, qty: 1 });

      const updated = await fetch(`http://localhost:8098/api/cart/${userId}`).then(
        (res) => res.json()
      );

      setCartItems(updated);

      alert("Added to cart!");
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------
  // SAVE NEW PRODUCT
  // --------------------------
  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
      return alert("Please fill Name, Price, Image URL, and Category");
    }

    try {
      // ⭐ Map category name to category_id
      const categoryObj = categoryOptions.find(
        (c) => c.name === newProduct.category
      );

      if (!categoryObj) return alert("Invalid category selected");

      const payload = {
        name: newProduct.name,
        price: Number(newProduct.price),
        category: categoryObj.name,
        subcategory: newProduct.subcategory || "",
        image: newProduct.image,
        ratingStars: Number(newProduct.rating_stars),
        ratingCount: Number(newProduct.rating_count),
        description: newProduct.description || "",
        keywords: newProduct.keywords || "",
        stock: Number(newProduct.stock || 0),
        category_id: categoryObj.id, // ✅ FK-safe
      };

      const res = await addStoreProduct(payload);

      if (!res.ok) throw new Error("Backend error");

      alert("Product added!");
      fetchProducts();
      setOpenModal(false);
      setNewProduct({
        name: "",
        price: 0,
        category: "",
        subcategory: "",
        image: "",
        rating_stars: 4.5,
        rating_count: 10,
        description: "",
        keywords: "",
        stock: 0,
        category_id: 1,
      });
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product: " + err.message);
    }
  };


return (
  <Box sx={{ 
      background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
    minHeight: "100vh",
    p: 3 
  }}>
    {/* FILTER BAR */}
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        position: "sticky",
        top: 0,
        zIndex: 10,
        mb: 3,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <TextField
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          flex: 1,
          minWidth: 300,
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            backgroundColor: "#f8f9fa",
            height: 48,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)"
            }
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#667eea" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        label="Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ 
          width: 200,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f8f9fa"
          },
          "& .MuiInputLabel-shrink": {
            color: "#667eea !important",
            fontWeight: 600
          }
        }}
      >
        {categoryList.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sort"
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        sx={{ 
          width: 200,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f8f9fa"
          },
          "& .MuiInputLabel-shrink": {
            color: "#667eea !important",
            fontWeight: 600
          }
        }}
      >
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="low-high">Low to High</MenuItem>
        <MenuItem value="high-low">High to Low</MenuItem>
      </TextField>

      {userRole === "ADMIN" && (
        <Button 
          variant="contained" 
          onClick={() => setOpenModal(true)}
          sx={{
            fontWeight: 700,
            bgcolor: "#05155aff",
            height: 48,
            px: 4,
            borderRadius: 50,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              bgcolor: "#2f3f9bff",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
              transform: "translateY(-2px)"
            },
            transition: "all 0.3s ease"
          }}
        >
          + Add Product
        </Button>
      )}
    </Paper>

    {/* PRODUCT GRID */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 3,
      }}
    >
      {loading
        ? Array.from(new Array(8)).map((_, i) => (
            <Card key={i} sx={{ borderRadius: 3 }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton height={30} width="70%" />
                <Skeleton height={20} width="40%" />
              </CardContent>
            </Card>
          ))
        : filtered.map((p) => (
            <Card 
              key={p.id} 
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  "& .product-image": {
                    transform: "scale(1.05)"
                  }
                }
              }}
            >
              <Box sx={{ 
                height: 200, 
                overflow: "hidden", 
                bgcolor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2
              }}>
                <CardMedia
                  component="img"
                  image={p.image}
                  className="product-image"
                  sx={{ 
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    transition: "transform 0.3s ease"
                  }}
                />
              </Box>
              
              <CardContent sx={{ 
                textAlign: "center", 
                p: 2.5,
                bgcolor: "#fff"
              }}>
                <Typography 
                  fontWeight={700} 
                  sx={{ 
                    mb: 1,
                    fontSize: "1rem",
                    lineHeight: 1.3,
                    minHeight: 40,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {p.name}
                </Typography>
                
                <Rating value={p.rating} readOnly size="small" sx={{ mb: 1 }} />
                
                <Typography 
                  sx={{ 
                    color: "#10b981", 
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    mb: 2
                  }}
                >
                  ₹{p.price}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{ 
                      minWidth: 50, 
                      width: 50, 
                      height: 50, 
                      p: 0, 
                      borderRadius: 2,
                      border: "0px ",
                    }}
                    onClick={() => toggleWishlist(p)}
                  >
                    {wishlistItems.find((x) => x.id === p.id) ? (
                      <FavoriteIcon sx={{ fontSize: 35, color: "#f13737ff" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 35, color: "#9ca3af" }} />
                    )}
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAddToCart(p)}
                    sx={{
                      fontWeight: 700,
                      bgcolor: "#05155aff",
                      height: 50,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        bgcolor: "#2f48d8ff",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
    </Box>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            width: 420,
            background: "white",
            p: 3,
            borderRadius: 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add New Product</Typography>

          <TextField
            fullWidth
            label="Product Name"
            sx={{ mt: 2 }}
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            sx={{ mt: 2 }}
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />

          <TextField
            fullWidth
            select
            label="Category"
            sx={{ mt: 2 }}
            value={newProduct.category}
            onChange={(e) => {
              const selected = categoryOptions.find(c => c.name === e.target.value);
              setNewProduct({
                ...newProduct,
                category: e.target.value,
                category_id: selected?.id || 1
              });
            }}
          >
            {categoryOptions.map((c) => (
              <MenuItem key={c.key} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Rating Stars"
            type="number"
            sx={{ mt: 2 }}
            inputProps={{ step: "0.1", min: 0, max: 5 }}
            value={newProduct.rating_stars}
            onChange={(e) =>
              setNewProduct({ ...newProduct, rating_stars: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Rating Count"
            type="number"
            sx={{ mt: 2 }}
            value={newProduct.rating_count}
            onChange={(e) =>
              setNewProduct({ ...newProduct, rating_count: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Image URL"
            placeholder="http://localhost:8098/product-images/201.jpg"
            sx={{ mt: 2 }}
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Stock"
            type="number"
            sx={{ mt: 2 }}
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSaveProduct}
          >
            Save Product
          </Button>
        </Box>
      </Modal>

  </Box>
)};