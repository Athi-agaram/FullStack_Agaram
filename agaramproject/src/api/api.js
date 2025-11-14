import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:8098/api",
  timeout: 10000,
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

// ==================== PRODUCTS ====================
export const addProduct = (payload) => API.post("/master/products", payload);
export const updateProduct = (id, payload) => API.put(`/master/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/master/products/${id}`);
export const getProducts = (teamName = "") =>
  API.get(`/master/products${teamName ? `?teamName=${teamName}` : ""}`);

// ==================== EMPLOYEES ====================
export const getEmployees = (teamName = "") =>
  API.get(`/master/employee${teamName ? `?teamName=${teamName}` : ""}`);

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
