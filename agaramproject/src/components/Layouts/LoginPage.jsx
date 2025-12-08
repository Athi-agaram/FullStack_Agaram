import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser, checkUsernameExists } from "../../api/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [usernameExists, setUsernameExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("recentlyRegisteredUsername");
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      localStorage.removeItem("recentlyRegisteredUsername");
    }
  }, []);

  useEffect(() => {
    if (!formData.username.trim()) {
      setUsernameExists(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await checkUsernameExists(formData.username.trim());
        setUsernameExists(res.data);
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }, 30);
    return () => clearTimeout(delayDebounce);
  }, [formData.username]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/home");
    } catch {
      setError("Invalid username or password*");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordFocus = () => {
    if (usernameExists === false) {
      navigate("/register", { state: { username: formData.username } });
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src="https://static.vecteezy.com/system/resources/previews/000/549/810/original/vector-abstract-technology-background-technology-digital-world-of-business-information-futuristic-blue-virtual-graphic-interface.jpg"
        alt="Background"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(1.00)",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Glass Login Box */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "85%", md: 400 },
          maxWidth: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 0 },
        }}
      >
        <Fade in timeout={10}>
          <Paper
            elevation={10}
            sx={{
              width: "100%",
              maxHeight: { xs: "90vh", sm: "auto" },
              overflowY: "auto",
              borderRadius: 3,
              textAlign: "center",
              p: { xs: 3, sm: 4 },
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.36)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                color: "#121146ff",
                fontSize: { xs: "1.5rem", sm: "1.75rem" }
              }}
            >
              Login
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={e =>
                  setFormData(prev => ({ ...prev, username: e.target.value }))
                }
                margin="normal"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.45)",
                  border: "transparent",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease-in-out",

                  "& .MuiInputLabel-shrink": {
                    color: "#2c2c2cff !important",
                    bgcolor: "rgba(255, 255, 255, 0.45)",
                    fontSize: { xs: "16px", sm: "18px" },
                    borderRadius: "5px !important",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  },

                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                  },

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.45)",
                    boxShadow: "inset 0 4px 8px rgba(255, 255, 255, 0.15)",
                  },

                  "& .MuiOutlinedInput-root": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent !important",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                      borderWidth: 0,
                    },
                  },
                }}
              />
              
              {usernameExists === false && (
                <Typography 
                  variant="body2" 
                  color="white" 
                  align="center"
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: "0.85rem", sm: "0.875rem" }
                  }}
                >
                  Username not found
                </Typography>
              )}

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onFocus={handlePasswordFocus}
                onChange={e =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                margin="normal"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.45)",
                  borderRadius: "none !important",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease-in-out",

                  "& .MuiInputLabel-shrink": {
                    color: "#464646ff !important",
                    bgcolor: "rgba(255, 255, 255, 0.45)",
                    fontSize: { xs: "16px", sm: "18px" },
                    borderRadius: "5px !important",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  },

                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                  },

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.45)",
                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.15)",
                  },

                  "& .MuiOutlinedInput-root": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                      borderWidth: 0,
                    },
                  },
                }}
              />

              {error && (
                <Typography 
                  variant="body2" 
                  color="error"
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: "0.85rem", sm: "0.875rem" }
                  }}
                >
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: { xs: 2, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  backgroundColor: "#1f3155",
                  "&:hover": { backgroundColor: "#0042cc" },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </form>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}