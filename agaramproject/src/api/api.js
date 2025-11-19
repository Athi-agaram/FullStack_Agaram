import axios from "axios";

// ==================== BASE ====================
const API = axios.create({
  baseURL: "http://localhost:8098/api",
});

// ==================== USERS ====================
export const loginUser = (payload) => API.post("/users/login", payload);
export const registerUser = (payload) => API.post("/users/register", payload);
export const getAllUsers = () => API.get("/users/all");
export const getTeamUsers = (teamName) => API.get(`/users/team/${teamName}`);

export const updateEmployee = (id, payload, currentUser) =>
  API.put(`/users/update/${id}?currentUser=${encodeURIComponent(currentUser)}`, payload);
export const deleteUser = (id, currentUser) =>
  API.delete(`/users/delete/${id}?currentUser=${encodeURIComponent(currentUser)}`);

export const checkUsernameExists = (username) =>
  API.get(`/users/check-username?username=${encodeURIComponent(username)}`);

// Profile
export const editUserProfile = (id, payload) => API.put(`/users/edit-profile/${id}`, payload);
export const changeUserPassword = (id, payload) => API.put(`/users/change-password/${id}`, payload);

// ==================== MASTER PRODUCTS (legacy) ====================
export const addProduct = (payload) => API.post("/master/products", payload);
export const updateProduct = (id, payload) => API.put(`/master/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/master/products/${id}`);
export const getProducts = (teamName = "") =>
  API.get(`/master/products${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== STORE PRODUCTS (new) ====================
export const getStoreProducts = () => API.get("/storeproducts");
export const getStoreProductById = (id) => API.get(`/storeproducts/${id}`);
export const getStoreProductsByCategory = (categoryId) =>
  API.get(`/storeproducts/category/${categoryId}`);
export const addStoreProduct = (payload) => API.post("/storeproducts", payload);
export const updateStoreProduct = (id, payload) => API.put(`/storeproducts/${id}`, payload);
export const deleteStoreProduct = (id) => API.delete(`/storeproducts/${id}`);

// ==================== CART / E-COMMERCE ====================
export const getCartApi = (userId) => API.get(`/cart/${userId}`);
export const addToCartApi = (payload) => API.post("/cart/add", payload); // { userId, productId, qty }
export const updateCartItemApi = (payload) => API.put("/cart/update", payload); // { cartId, qty }
export const removeCartItemApi = (cartId) => API.delete(`/cart/delete/${cartId}`);

// ==================== ORDERS ====================
export const checkoutApi = (userId) => API.post(`/orders/checkout/${userId}`);
export const getOrdersApi = (userId) => API.get(`/orders/${userId}`);

// ==================== BASIC REVENUE ====================
export const getRevenue = (teamName = "") =>
  API.get(`/master/revenue${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== ADVANCED REVENUE ====================
export const getRevenueSummary = () => API.get("/master/revenue/summary");
export const getTeamRevenue = () => API.get("/master/revenue/team-wise");
export const getMonthlyRevenue = () => API.get("/master/revenue/month-wise");
export const getEmployeeRevenue = () => API.get("/master/revenue/employee-wise");

// ==================== REVENUE DASHBOARD ====================
export const getRevenueDashboard = () => API.get("/master/revenue/dashboard");

// ==================== TEAMS ====================
export const getTeams = async () => {
  try {
    const res = await API.get("/master/teams");
    return res.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

// ==================== CATEGORIES ====================
export const getCategories = () => API.get("/ecommerce/categories");
export const createCategory = (payload) => API.post("/ecommerce/categories", payload);
// ==================== CART / E-COMMERCE ====================
export const saveForLaterApi = (cartId) => API.post(`/cart/save/${cartId}`);
export const moveToCartApi = (cartId) => API.post(`/cart/move/${cartId}`);
