// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Select,
//   MenuItem,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { getProducts, addProduct, updateProduct, deleteProduct } from "../../api/api";

// const PROGRESS_OPTIONS = ["In Progress", "Completed", "Sold"];

// export default function ProductTab({ user }) {
//   const [products, setProducts] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({});
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // ✅ Load products
//   const loadProducts = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;
//     getProducts(teamName)
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : [];
//         setProducts(data);
//       })
//       .catch((err) => {
//         console.error("Failed to load products:", err);
//         setProducts([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // ✅ Open dialog for add/edit
//   const handleOpen = (row = null) => {
//     if (row) {
//       setForm({
//         name: row.name,
//         quantity: row.quantity,
//         price: row.price,
//         progress: row.progress,
//         team_name: row.team_name,
//         employee_id: row.employee_id || user.id,
//       });
//       setIsEdit(true);
//       setEditId(row.id);
//     } else {
//       setForm({
//         name: "",
//         quantity: "",
//         price: "",
//         progress: "In Progress",
//         team_name: user.team_name,
//         employee_id: user.id,
//       });
//       setIsEdit(false);
//       setEditId(null);
//     }
//     setOpen(true);
//   };

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Save product
//   const handleSave = async () => {
//     try {
//       const payload = { ...form };
//       if (isEdit) await updateProduct(editId, payload);
//       else await addProduct(payload);
//       setOpen(false);
//       loadProducts();
//     } catch (err) {
//       console.error("Error saving product:", err);
//       alert("Save failed");
//     }
//   };

//   // ✅ Delete product
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await deleteProduct(id);
//       loadProducts();
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       alert("Delete failed");
//     }
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       {(user.role === "ADMIN" || user.role === "MANAGER") && (
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpen()}
//           sx={{ mb: 2 }}
//         >
//           Add Product
//         </Button>
//       )}

//       <Table size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>ID</TableCell>
//             <TableCell>Product</TableCell>
//             <TableCell>Quantity</TableCell>
//             <TableCell>Price</TableCell>
//             <TableCell>Team</TableCell>
//             <TableCell>Progress</TableCell>
//             {(user.role === "ADMIN" || user.role === "MANAGER") && (
//               <TableCell align="center">Actions</TableCell>
//             )}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {products.length > 0 ? (
//             products.map((p) => (
//               <TableRow key={p.id}>
//                 <TableCell>{p.id}</TableCell>
//                 <TableCell>{p.name}</TableCell>
//                 <TableCell>{p.quantity}</TableCell>
//                 <TableCell>{p.price}</TableCell>
//                 <TableCell>{p.team_name}</TableCell>
//                 <TableCell>{p.progress}</TableCell>
//                 {(user.role === "ADMIN" || user.role === "MANAGER") && (
//                   <TableCell align="center">
//                     <Tooltip title="Edit">
//                       <IconButton
//                         color="primary"
//                         onClick={() => handleOpen(p)}
//                         sx={{
//                           "&:hover": { color: "blue" },
//                         }}
//                       >
//                         <EditIcon />
//                       </IconButton>
//                     </Tooltip>

//                     <Tooltip title="Delete">
//                       <IconButton
//                         color="error"
//                         onClick={() => handleDelete(p.id)}
//                         sx={{
//                           "&:hover": { color: "red" },
//                         }}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Tooltip>
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={7} align="center">
//                 No products available
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* ✅ Dialog for add/edit */}
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
//         <DialogContent
//           sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
//         >
//           <TextField
//             label="Product Name"
//             name="name"
//             value={form.name || ""}
//             onChange={handleChange}
//           />
//           <TextField
//             label="Quantity"
//             name="quantity"
//             type="number"
//             value={form.quantity || ""}
//             onChange={handleChange}
//           />
//           <TextField
//             label="Price"
//             name="price"
//             type="number"
//             value={form.price || ""}
//             onChange={handleChange}
//           />

//           <TextField
//             label="Team"
//             name="team_name"
//             value={form.team_name || ""}
//             onChange={handleChange}
//             disabled={user.role !== "ADMIN"}
//           />

//           <Select
//             name="progress"
//             value={form.progress || "In Progress"}
//             onChange={handleChange}
//           >
//             {PROGRESS_OPTIONS.map((p) => (
//               <MenuItem key={p} value={p}>
//                 {p}
//               </MenuItem>
//             ))}
//           </Select>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleSave} variant="contained">
//             {isEdit ? "Update" : "Add"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Tooltip,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { getProducts, addProduct, updateProduct, deleteProduct } from "../../api/api";

// const PROGRESS_OPTIONS = ["In Progress", "Completed", "Sold"];

// export default function ProductTab({ user }) {
//   const [rows, setRows] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({});
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // ---------------- LOAD PRODUCTS ----------------
//   const loadProducts = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;
//     getProducts(teamName)
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : [];
//         // Add S.No to each row
//         const dataWithSno = data.map((item, index) => ({ ...item, sno: index + 1 }));
//         setRows(dataWithSno);
//       })
//       .catch((err) => {
//         console.error("Failed to load products:", err);
//         setRows([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // ---------------- OPEN DIALOG ----------------
//   const handleOpen = (row = null) => {
//     if (row) {
//       setForm({
//         name: row.name,
//         quantity: row.quantity,
//         price: row.price,
//         progress: row.progress,
//         team_name: row.team_name,
//         employee_id: row.employee_id || user.id,
//       });
//       setIsEdit(true);
//       setEditId(row.id);
//     } else {
//       setForm({
//         name: "",
//         quantity: "",
//         price: "",
//         progress: "In Progress",
//         team_name: user.team_name,
//         employee_id: user.id,
//       });
//       setIsEdit(false);
//       setEditId(null);
//     }
//     setOpen(true);
//   };

//   // ---------------- HANDLE INPUT ----------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // ---------------- SAVE PRODUCT ----------------
//   const handleSave = async () => {
//     try {
//       const payload = { ...form };
//       if (isEdit) await updateProduct(editId, payload);
//       else await addProduct(payload);
//       setOpen(false);
//       loadProducts();
//     } catch (err) {
//       console.error("Error saving product:", err);
//       alert("Save failed");
//     }
//   };

//   // ---------------- DELETE PRODUCT ----------------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await deleteProduct(id);
//       loadProducts();
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       alert("Delete failed");
//     }
//   };

//   // ---------------- COLUMNS ----------------
//   const columns = [
//     {
//       field: "sno",
//       headerName: "S.No",
//       width: 100,
//       sortable: false,
//       filterable: false,
//     },
//     { field: "id", headerName: "ID", width: 120 },
//     { field: "name", headerName: "Product", width: 200 },
//     { field: "quantity", headerName: "Quantity", width: 120 },
//     { field: "price", headerName: "Price", width: 120 },
//     { field: "team_name", headerName: "Team", width: 180 },
//     { field: "progress", headerName: "Progress", width: 200 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 150,
//       sortable: false,
//       filterable: false,
//       renderCell: (params) => (
//         <Box>
//           {(user.role === "ADMIN" || user.role === "MANAGER") && (
//             <>
//               <Tooltip title="Edit">
//                 <IconButton color="primary" onClick={() => handleOpen(params.row)} size="small">
//                   <EditIcon />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Delete">
//                 <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
//                   <DeleteIcon />
//                 </IconButton>
//               </Tooltip>
//             </>
//           )}
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box sx={{ height: 420, width: "100%" }}>
//       {(user.role === "ADMIN" || user.role === "MANAGER") && (
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpen()}
//           sx={{ mb: 1, mt: 1 }}
//         >
//           Add Product
//         </Button>
//       )}

//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSizeOptions={[5, 14, 20]}
//         initialState={{
//           pagination: { paginationModel: { page: 0, pageSize: 5 } },
//         }}
//         pagination
//         disableRowSelectionOnClick
//         sx={{
//           border: 0,
//           "& .MuiDataGrid-cell": { outline: "none" },
//           "& .MuiDataGrid-root": { overflowX: "hidden" }, // prevent horizontal scroll
//         }}
//         autoHeight
//       />

//       {/* ---------------- DIALOG ---------------- */}
//       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
//           <TextField
//             label="Product Name"
//             name="name"
//             value={form.name || ""}
//             onChange={handleChange}
//           />
//           <TextField
//             label="Quantity"
//             name="quantity"
//             type="number"
//             value={form.quantity || ""}
//             onChange={handleChange}
//           />
//           <TextField
//             label="Price"
//             name="price"
//             type="number"
//             value={form.price || ""}
//             onChange={handleChange}
//           />
//           <TextField
//             label="Team"
//             name="team_name"
//             value={form.team_name || ""}
//             onChange={handleChange}
//             disabled={user.role !== "ADMIN"}
//           />
//           <Select name="progress" value={form.progress || "In Progress"} onChange={handleChange}>
//             {PROGRESS_OPTIONS.map((p) => (
//               <MenuItem key={p} value={p}>
//                 {p}
//               </MenuItem>
//             ))}
//           </Select>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleSave} variant="contained">
//             {isEdit ? "Update" : "Add"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Tooltip,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { getProducts, addProduct, updateProduct, deleteProduct } from "../../api/api";

// const PROGRESS_OPTIONS = ["In Progress", "Completed", "Sold"];
// const MONTH_OPTIONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// export default function ProductTab({ user }) {
//   const [rows, setRows] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({});
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false); // ✅ FIX: track loading state


//   // ---------------- LOAD PRODUCTS ----------------
//   const loadProducts = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;
//     getProducts(teamName)
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : [];
//         const dataWithSno = data.map((item, index) => ({ ...item, sno: index + 1 }));
//         setRows(dataWithSno);
//       })
//       .catch((err) => {
//         console.error("Failed to load products:", err);
//         setRows([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // ---------------- OPEN DIALOG ----------------
//   const handleOpen = (row = null) => {
//     if (row) {
//       setForm({
//         name: row.name,
//         quantity: row.quantity,
//         price: row.price,
//         progress: row.progress,
//         team_name: row.team_name,
//         employee_id: row.employee_id || user.id,
//         sale_month: row.sale_month || "Jan",
//       });
//       setIsEdit(true);
//       setEditId(row.id);
//     } else {
//       setForm({
//         name: "",
//         quantity: "",
//         price: "",
//         progress: "In Progress",
//         team_name: user.team_name,
//         employee_id: user.id,
//         sale_month: "Jan",
//       });
//       setIsEdit(false);
//       setEditId(null);
//     }
//     setOpen(true);
//   };

//   // ---------------- HANDLE INPUT ----------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // ---------------- SAVE PRODUCT ----------------
//   const handleSave = async () => {
//     try {
//       const payload = { ...form };
//       if (isEdit) await updateProduct(editId, payload);
//       else await addProduct(payload);
//       setOpen(false);
//       loadProducts();
//     } catch (err) {
//       console.error("Error saving product:", err);
//       alert("Save failed");
//     }
//   };

//   // ---------------- DELETE PRODUCT ----------------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await deleteProduct(id);
//       loadProducts();
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       alert("Delete failed");
//     }
//   };

//   // ---------------- COLUMNS ----------------
//   const columns = [
//     { field: "sno", headerName: "S.No", width: 100, sortable: false, filterable: false },
//     { field: "id", headerName: "ID", width: 120 },
//     { field: "name", headerName: "Product", width: 150 },
//     { field: "quantity", headerName: "Quantity", width: 120 },
//     { field: "price", headerName: "Price", width: 120 },
//     { field: "team_name", headerName: "Team", width: 140 },
//     { field: "progress", headerName: "Progress", width: 150 },
//     { field: "sale_month", headerName: "Month", width: 120 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 150,
//       sortable: false,
//       filterable: false,
//       renderCell: (params) => (
//         <Box>
//           {(user.role === "ADMIN" || user.role === "MANAGER") && (
//             <>
//               <Tooltip title="Edit">
//                 <IconButton color="primary" onClick={() => handleOpen(params.row)} size="small">
//                   <EditIcon />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Delete">
//                 <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
//                   <DeleteIcon />
//                 </IconButton>
//               </Tooltip>
//             </>
//           )}
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box sx={{ height: 420, width: "100%" }}>
//       {(user.role === "ADMIN" || user.role === "MANAGER") && (
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpen()}
//           sx={{ mb: 1, mt: 1 }}
//         >
//           Add Product
//         </Button>
//       )}

//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSizeOptions={[5, 10, 20]}
//         initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
//         pagination
//         disableRowSelectionOnClick
//         sx={{
//           border: 0,
//           "& .MuiDataGrid-cell": { outline: "none" },
//           "& .MuiDataGrid-root": { overflowX: "hidden" },
//         }}
//         autoHeight
//       />

//       {/* ---------------- DIALOG ---------------- */}
//       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
//           <TextField label="Product Name" name="name" value={form.name || ""} onChange={handleChange} />
//           <TextField label="Quantity" name="quantity" type="number" value={form.quantity || ""} onChange={handleChange} />
//           <TextField label="Price" name="price" type="number" value={form.price || ""} onChange={handleChange} />
//           <TextField
//             label="Team"
//             name="team_name"
//             value={form.team_name || ""}
//             onChange={handleChange}
//             disabled={user.role !== "ADMIN"}
//           />
//           <Select name="progress" value={form.progress || "In Progress"} onChange={handleChange}>
//             {PROGRESS_OPTIONS.map((p) => (
//               <MenuItem key={p} value={p}>
//                 {p}
//               </MenuItem>
//             ))}
//           </Select>
//           <Select name="sale_month" value={form.sale_month || "Jan"} onChange={handleChange}>
//             {MONTH_OPTIONS.map((m) => (
//               <MenuItem key={m} value={m}>
//                 {m}
//               </MenuItem>
//             ))}
//           </Select>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleSave} variant="contained">{isEdit ? "Update" : "Add"}</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }


import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/api";

const PROGRESS_OPTIONS = ["In Progress", "Completed", "Sold"];
const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function ProductTab({ user }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevData = useRef([]); // ✅ keep previous data reference
  const CURRENT_MONTH = MONTH_OPTIONS[new Date().getMonth()];


  // ---------------- LOAD PRODUCTS ----------------
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const teamName = user?.role === "ADMIN" ? "" : user.team_name;
      const res = await getProducts(teamName);
      const data = Array.isArray(res.data) ? res.data : [];

      // ✅ Diff update: only replace changed items
      const newData = data.map((item, index) => ({
        ...item,
        sno: index + 1,
        id: item.id ?? index,
      }));

      // compare shallowly to reduce DataGrid repaint
      const sameLength = newData.length === prevData.current.length;
      const sameContent =
        sameLength &&
        newData.every((r, i) => JSON.stringify(r) === JSON.stringify(prevData.current[i]));

      if (!sameContent) {
        setRows(newData);
        prevData.current = newData;
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ---------------- OPEN DIALOG ----------------
  const handleOpen = (row = null) => {
    if (row) {
      setForm({
        name: row.name,
        quantity: row.quantity,
        price: row.price,
        progress: row.progress,
        team_name: row.team_name,
        employee_id: row.employee_id || user.id,
        sale_month: row.sale_month || CURRENT_MONTH,
      });
      setIsEdit(true);
      setEditId(row.id);
    } else {
      setForm({
        name: "",
        quantity: "",
        price: "",
        progress: "In Progress",
        team_name: user.team_name,
        employee_id: user.id,
        sale_month: CURRENT_MONTH,
      });
      setIsEdit(false);
      setEditId(null);
    }
    setOpen(true);
  };

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- SAVE PRODUCT ----------------
  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (isEdit) await updateProduct(editId, payload);
      else await addProduct(payload);
      setOpen(false);
      await loadProducts(); // ✅ await ensures smooth refresh
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Save failed");
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Delete failed");
    }
  };

  // ---------------- COLUMNS ----------------
  const columns = [
    { field: "sno", headerName: "S.No", width: 90 },
    { field: "id", headerName: "ID", width: 110 ,renderCell: (params) => `P${params.value}`},
    { field: "name", headerName: "Product", width: 160 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "team_name", headerName: "Team", width: 163 },
    { field: "progress", headerName: "Progress", width: 190 },
    { field: "sale_month", headerName: "Month", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
  
      renderCell: (params) => (
        <Box>
          {(user.role === "ADMIN" || user.role === "MANAGER") && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={() => handleOpen(params.row)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => handleDelete(params.row.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height:390, width: "100%" }}>


<DataGrid
  rows={rows}
  columns={columns}
  getRowId={(row) => row.id} // ✅ stable key for DataGrid
  pagination
  pageSizeOptions={[6, 10, 20]}
  initialState={{
    pagination: { paginationModel: { page: 0, pageSize: 6 } },
  }}
  disableRowSelectionOnClick
  autoHeight
  loading={loading}
  sx={{
    border: 0,
    ml:0,
    "& .MuiDataGrid-cell": { outline: "none" },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#e4e4e4ff", // light grey
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#e4e4e4ff", // ensure each header cell also gets it
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600, // ✅ ensure header text itself is bold

    },
  }}
/>
      {(user.role === "ADMIN" || user.role === "MANAGER") && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ mb: 1, mt: 2.5,ml:128 }}
        >
          Add Product
        </Button>
      )}


      {/* ---------------- DIALOG ---------------- */}
      <Dialog open={open}  maxWidth="xs" fullWidth>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
        >
          <TextField
            label="Product Name"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity || ""}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price || ""}
            onChange={handleChange}
          />
          <TextField
            label="Team"
            name="team_name"
            value={form.team_name || ""}
            onChange={handleChange}
            disabled={user.role !== "ADMIN"}
          />
          <Select
            name="progress"
            value={form.progress || "In Progress"}
            onChange={handleChange}
          >
            {PROGRESS_OPTIONS.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
          <Select
            name="sale_month"
            value={form.sale_month || "Jan"}
            onChange={handleChange}
          >
            {MONTH_OPTIONS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
