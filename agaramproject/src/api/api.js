// import axios from "axios";

// // ==================== BASE ====================
// const API = axios.create({
//   baseURL: "http://localhost:8098/api",
// });
// // const API = axios.create({
// //   baseURL: `${window.location.origin}/agaram-project-backend-completed/api`,
// // });
// // ==================== USERS ====================
// export const loginUser = (payload) => API.post("/users/login", payload);
// export const registerUser = (payload) => API.post("/users/register", payload);
// export const getAllUsers = () => API.get("/users/all");
// export const getTeamUsers = (teamName) => API.get(`/users/team/${teamName}`);

// export const updateEmployee = (id, payload, currentUser) =>
//   API.put(
//     `/users/update/${id}?currentUser=${encodeURIComponent(currentUser)}`,
//     payload
//   );

// export const deleteUser = (id, currentUser) =>
//   API.delete(
//     `/users/delete/${id}?currentUser=${encodeURIComponent(currentUser)}`
//   );

// export const checkUsernameExists = (username) =>
//   API.get(`/users/check-username?username=${encodeURIComponent(username)}`);

// export const editUserProfile = (id, payload) =>
//   API.put(`/users/edit-profile/${id}`, payload);

// export const changeUserPassword = (id, payload) =>
//   API.put(`/users/change-password/${id}`, payload);

// // ==================== MASTER PRODUCTS ====================
// export const addProduct = (payload) => API.post("/master/products", payload);
// export const updateProduct = (id, payload) =>
//   API.put(`/master/products/${id}`, payload);
// export const deleteProduct = (id) => API.delete(`/master/products/${id}`);
// export const getProducts = (teamName = "") =>
//   API.get(`/master/products${teamName ? `?teamName=${teamName}` : ""}`);

// // ==================== STORE PRODUCTS ====================
// export const getStoreProducts = () => API.get("/storeproducts");
// export const getStoreProductById = (id) => API.get(`/storeproducts/${id}`);
// export const getStoreProductsByCategory = (categoryId) =>
//   API.get(`/storeproducts/category/${categoryId}`);
// export const updateStoreProduct = (id, payload) =>
//   API.put(`/storeproducts/${id}`, payload);
// export const deleteStoreProduct = (id) =>
//   API.delete(`/storeproducts/${id}`);
// // STORE PRODUCTS
// export const addStoreProduct = async (payload) => {
//   try {
//     const res = await API.post("/storeproducts", payload);
//     // Backend returns { success: true/false }
//     return { ok: res.data.success, data: res.data };
//   } catch (err) {
//     console.error("Error adding store product:", err);
//     return { ok: false };
//   }
// };


// // ==================== CART ====================

// // GET CART
// export const getCartApi = (userId) => API.get(`/cart/${userId}`);

// // ADD TO CART
// export const addToCartApi = (data) => API.post(`/cart/add`, data);

// // UPDATE CART (qty + save-for-later flag)
// export const updateCartItemApi = (cartId, qty, is_saved = null) =>
//   API.put(`/cart/update/${cartId}`, { qty, is_saved });

// // DELETE CART ITEM
// export const removeCartItemApi = (cartId) => API.delete(`/cart/${cartId}`);

// // SAVE FOR LATER
// export const saveForLaterApi = (cartId) => API.post(`/cart/save/${cartId}`);

// // MOVE TO CART
// export const moveToCartApi = (cartId) => API.post(`/cart/move/${cartId}`);

// // ==================== ORDERS ====================

// // CHECKOUT
// export const checkoutApi = (userId) => API.post(`/orders/checkout/${userId}`);

// // GET ORDERS - Updated to pass username in header
// export const getOrdersApi = (userId, username) => {
//   return API.get(`/orders/${userId}`, {
//     headers: username ? { username } : {},
//   });
// };

// // UPDATE ORDER STATUS - Updated to match backend
// export const updateOrderStatusApi = (orderId, status, currentStatus, username) => {
//   return API.put(
//     `/orders/status`,
//     { orderId, status, currentStatus },
//     { headers: { username } }
//   );
// };

// // ==================== NOTIFICATIONS ====================

// // GET NOTIFICATIONS
// export const getNotificationsApi = (username) => {
//   return API.get("/orders/notifications", {
//     headers: { username }
//   });
// };

// // SEND NOTIFICATION - Updated to include status
// export const sendNotificationApi = (data) => {
//   return API.post("/orders/notifications/send", data, {
//     headers: { username: data.username }
//   });
// };

// // ==================== REVENUE ====================
// export const getRevenue = (teamName = "") =>
//   API.get(`/master/revenue${teamName ? `?teamName=${teamName}` : ""}`);

// export const getRevenueSummary = () => API.get("/master/revenue/summary");
// export const getTeamRevenue = () => API.get("/master/revenue/team-wise");
// export const getMonthlyRevenue = () => API.get("/master/revenue/month-wise");
// export const getEmployeeRevenue = () => API.get("/master/revenue/employee-wise");
// export const getRevenueDashboard = () => API.get("/master/revenue/dashboard");

// // ==================== TEAMS ====================
// export const getTeams = async () => {
//   try {
//     const res = await API.get("/master/teams");
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching teams:", error);
//     return [];
//   }
// };

// // ==================== CATEGORIES ====================
// export const getCategories = () => API.get("/ecommerce/categories");
// export const createCategory = (payload) => API.post("/ecommerce/categories", payload);

// // ==================== WISHLIST ====================

// // GET WISHLIST for user
// export const getWishlistApi = (userId) => API.get(`/wishlist?userId=${userId}`);

// // ADD ITEM to wishlist
// export const addWishlistApi = (userId, productId, qty = 1) =>
//   API.post(`/wishlist?userId=${userId}&productId=${productId}&qty=${qty}`);

// // REMOVE ITEM from wishlist
// export const removeWishlistApi = (userId, wishlistId) =>
//   API.delete(`/wishlist/${wishlistId}?userId=${userId}`, {
//     validateStatus: () => true, // Prevent Axios error on 204
//   });


// // ------------------------ IMAGE UPLOAD + FETCH ------------------------

// // Upload image (multipart/form-data)
// export const uploadImageApi = (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   return API.post("/images/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };

// // Get image by ID (returns raw blob)
// export const getImageApi = (id) =>
//   API.get(`/images/${id}`, { responseType: "blob" });


import axios from "axios";

// ==================== BASE ====================
const API = axios.create({
  // baseURL: "http://localhost:8098/api",
      baseURL: "http://192.168.0.224:8098/api",

});
// const API = axios.create({
//   baseURL: `${window.location.origin}/agaram-project-backend-completed/api`,
// });

// ==================== USERS ====================
export const loginUser = (payload) => API.post("/users/login", payload);
export const registerUser = (payload) => API.post("/users/register", payload);
export const getAllUsers = () => API.get("/users/all");
export const getTeamUsers = (teamName) => API.get(`/users/team/${teamName}`);

export const updateEmployee = (id, payload, currentUser) =>
  API.put(
    `/users/update/${id}?currentUser=${encodeURIComponent(currentUser)}`,
    payload
  );

export const deleteUser = (id, currentUser) =>
  API.delete(
    `/users/delete/${id}?currentUser=${encodeURIComponent(currentUser)}`
  );

export const checkUsernameExists = (username) =>
  API.get(`/users/check-username?username=${encodeURIComponent(username)}`);

export const editUserProfile = (id, payload) =>
  API.put(`/users/edit-profile/${id}`, payload);

export const changeUserPassword = (id, payload) =>
  API.put(`/users/change-password/${id}`, payload);

// ==================== MASTER PRODUCTS ====================
export const addProduct = (payload) => API.post("/master/products", payload);
export const updateProduct = (id, payload) =>
  API.put(`/master/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/master/products/${id}`);
export const getProducts = (teamName = "") =>
  API.get(`/master/products${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== STORE PRODUCTS ====================
export const getStoreProducts = () => API.get("/storeproducts");
export const getStoreProductById = (id) => API.get(`/storeproducts/${id}`);
export const getStoreProductsByCategory = (categoryId) =>
  API.get(`/storeproducts/category/${categoryId}`);
export const updateStoreProduct = (id, payload) =>
  API.put(`/storeproducts/${id}`, payload);
export const deleteStoreProduct = (id) =>
  API.delete(`/storeproducts/${id}`);

export const addStoreProduct = async (payload) => {
  try {
    const res = await API.post("/storeproducts", payload);
    return { ok: res.data.success, data: res.data };
  } catch (err) {
    console.error("Error adding store product:", err);
    return { ok: false };
  }
};

// ==================== CART ====================

export const getCartApi = (userId) => API.get(`/cart/${userId}`);
export const addToCartApi = (data) => API.post(`/cart/add`, data);
export const updateCartItemApi = (cartId, qty, is_saved = null) =>
  API.put(`/cart/update/${cartId}`, { qty, is_saved });
export const removeCartItemApi = (cartId) => API.delete(`/cart/${cartId}`);
export const saveForLaterApi = (cartId) => API.post(`/cart/save/${cartId}`);
export const moveToCartApi = (cartId) => API.post(`/cart/move/${cartId}`);

// ==================== ORDERS ====================

export const checkoutApi = (userId) => API.post(`/orders/checkout/${userId}`);

export const getOrdersApi = (userId, username) => {
  return API.get(`/orders/${userId}`, {
    headers: username ? { username } : {},
  });
};

export const updateOrderStatusApi = (orderId, status, currentStatus, username) => {
  return API.put(
    `/orders/status`,
    { orderId, status, currentStatus },
    { headers: { username } }
  );
};

// ==================== NOTIFICATIONS ====================

export const getNotificationsApi = (username) => {
  return API.get("/orders/notifications", {
    headers: { username }
  });
};

export const sendNotificationApi = (data) => {
  return API.post("/orders/notifications/send", data, {
    headers: { username: data.username }
  });
};

// ==================== RETURN/EXCHANGE ====================

// Create a new return or exchange request
export const createReturnExchangeApi = (payload) => 
  API.post("/returns-exchanges", payload);

// Get all return/exchange requests (for admin)
export const getAllReturnExchangesApi = () => 
  API.get("/returns-exchanges/all");

// Get return/exchange requests for a specific user
export const getReturnExchangesByUserApi = (userId) => 
  API.get(`/returns-exchanges/user/${userId}`);

// Get a specific return/exchange by ID
export const getReturnExchangeByIdApi = (id) => 
  API.get(`/returns-exchanges/${id}`);

// Admin review (approve/reject) return/exchange
export const reviewReturnExchangeApi = (id, reviewData) => 
  API.post(`/returns-exchanges/${id}/review`, reviewData);

// Update return/exchange progress (warehouse, distributor, agent, courier)
export const updateReturnExchangeProgressApi = (id, updateData) => 
  API.post(`/returns-exchanges/${id}/update-progress`, updateData);

// ==================== REVENUE ====================
export const getRevenue = (teamName = "") =>
  API.get(`/master/revenue${teamName ? `?teamName=${teamName}` : ""}`);

export const getRevenueSummary = () => API.get("/master/revenue/summary");
export const getTeamRevenue = () => API.get("/master/revenue/team-wise");
export const getMonthlyRevenue = () => API.get("/master/revenue/month-wise");
export const getEmployeeRevenue = () => API.get("/master/revenue/employee-wise");
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

// ==================== WISHLIST ====================

export const getWishlistApi = (userId) => API.get(`/wishlist?userId=${userId}`);

export const addWishlistApi = (userId, productId, qty = 1) =>
  API.post(`/wishlist?userId=${userId}&productId=${productId}&qty=${qty}`);

export const removeWishlistApi = (userId, wishlistId) =>
  API.delete(`/wishlist/${wishlistId}?userId=${userId}`, {
    validateStatus: () => true,
  });

// ==================== IMAGE UPLOAD + FETCH ====================

export const uploadImageApi = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getImageApi = (id) =>
  API.get(`/images/${id}`, { responseType: "blob" });