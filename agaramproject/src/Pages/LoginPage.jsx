// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Fade,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { loginUser, checkUsernameExists } from "../api/api";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [usernameExists, setUsernameExists] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // ✅ Prefill username if returning after registration
//   useEffect(() => {
//     const savedUsername = localStorage.getItem("recentlyRegisteredUsername");
//     if (savedUsername) {
//       setUsername(savedUsername);
//       localStorage.removeItem("recentlyRegisteredUsername"); // clear it after use
//     }
//   }, []);

//   // ✅ Check username existence (debounced)
//   useEffect(() => {
//     if (!username.trim()) {
//       setUsernameExists(null);
//       return;
//     }

//     const delayDebounce = setTimeout(async () => {
//       try {
//         const res = await checkUsernameExists(username.trim());
//         setUsernameExists(res.data);
//       } catch (err) {
//         console.error("Error checking username:", err);
//       }
//     }, 30);

//     return () => clearTimeout(delayDebounce);
//   }, [username]);

//   // ✅ Handle login
//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await loginUser({ username, password });
//       localStorage.setItem("user", JSON.stringify(res.data));
//       navigate("/home");
//     } catch (err) {
//       setError("Invalid username or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Redirect if username not found when focusing password box
//   const handlePasswordFocus = () => {
//     if (usernameExists === false) {
//       navigate("/register", { state: { username } });
//     }
//   };

//   // ✅ Handle Enter key to login
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleLogin();
//     }
//   };

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #08193dff 0%, #eaeaf3ff 100%)",
//         padding: 4,
//         overflow: "hidden", // ✅ prevents scroll

//       }}
//     >
//       {/* Left Image */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           mb: 8,
//           ml: 15,
//         }}
//       >
//         <Box
//           component="img"
//           src="https://scontent.fmaa3-2.fna.fbcdn.net/v/t39.30808-6/482029405_9293251904057799_4287303386032315694_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HQoY1MdNwHgQ7kNvwGy3XG-&_nc_oc=AdmMk_EKAw-EULB6gcDwm27RMExc7OBQDOvxkxqOeDpvuSwUVzHMP-GKdv4C--0ckpQ&_nc_zt=23&_nc_ht=scontent.fmaa3-2.fna&_nc_gid=2iiZ7abYdGzwuvvgRaNHFg&oh=00_AfhftGLUjtdtOYA_mNSocLAptTBdLNqReemwcO1jSaLdNg&oe=691B4FEA"
//           alt="Login Visual"
//           sx={{
//             width: "100%",
//             height: "100%",
//             borderRadius: "10px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
//           }}
//         />
//       </Box>

//       {/* Right Login Panel */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Fade in timeout={800}>
//           <Paper
//             elevation={0}
//             sx={{
//               padding: 5,
//               width: 300,
//               height: 495,
//               mb: 8,
//               mr: 25,
//               borderRadius: 2,
//               textAlign: "center",
//               alignContent: "center",
//               backdropFilter: "blur(15px)",
//               background: "rgba(255, 255, 255, 0.15)",
//               border: "1px solid rgba(255, 255, 255, 0.3)",
//               boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
//               color: "white",
//             }}
//           >
//             <Typography
//               variant="h5"
//               gutterBottom
//               fontWeight="bold"
//               sx={{ color: "#1d1561ff" }}
//             >
//               Login
//             </Typography>

//             {/* ✅ Username */}
//             <TextField
//               fullWidth
//               label="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               margin="normal"
//               sx={{
//                 bgcolor: "rgba(255, 255, 255, 1)",
//                 borderRadius: 1,
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "grey" },
//                   "&:hover fieldset": { borderColor: "black" },
//                   "&.Mui-focused fieldset": { borderColor: "grey" },
//                 },
//                 "& .MuiInputLabel-root": { color: "grey" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "black" },
//               }}
           
//             />
//             {usernameExists && (
//               <Typography variant="body2" color="success.main" align="left">
//                 Username exists
//               </Typography>
//             )}
//             {usernameExists === false && (
//               <Typography variant="body2" color="error" align="left">
//                 Username not found*
//               </Typography>
//             )}

//             {/* ✅ Password */}
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               value={password}
//               onFocus={handlePasswordFocus}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyDown={handleKeyDown}
//               margin="normal"
//               sx={{
//                 bgcolor: "rgba(255, 255, 255, 1)",
//                 borderRadius: 1,
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "grey" },
//                   "&:hover fieldset": { borderColor: "black" },
//                   "&.Mui-focused fieldset": { borderColor: "grey" },
//                 },
//                 "& .MuiInputLabel-root": { color: "grey" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "black" },
//               }}
//             />

//             {error && (
//               <Typography variant="body2" color="error">
//                 {error}
//               </Typography>
//             )}

//             {/* ✅ Login Button */}
//             <Button
//               fullWidth
//               variant="contained"
//               onClick={handleLogin}
//               disabled={loading || !usernameExists}
//               sx={{
//                 mt: 3,
//                 borderRadius: 2,
//                 backgroundColor: "#1f3155ff",
//                 "&:hover": { backgroundColor: "#0042cc" },
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </Paper>
//         </Fade>
//       </Box>
//     </Box>
//   );
// }



// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Fade,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { loginUser, checkUsernameExists } from "../api/api";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [usernameExists, setUsernameExists] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Prefill username if returning after registration
//   useEffect(() => {
//     const savedUsername = localStorage.getItem("recentlyRegisteredUsername");
//     if (savedUsername) {
//       setUsername(savedUsername);
//       localStorage.removeItem("recentlyRegisteredUsername");
//     }
//   }, []);

//   // Check username existence (debounced)
//   useEffect(() => {
//     if (!username.trim()) {
//       setUsernameExists(null);
//       return;
//     }

//     const delayDebounce = setTimeout(async () => {
//       try {
//         const res = await checkUsernameExists(username.trim());
//         setUsernameExists(res.data);
//       } catch (err) {
//         console.error("Error checking username:", err);
//       }
//     }, 300); // increased to 300ms for better debounce

//     return () => clearTimeout(delayDebounce);
//   }, [username]);

//   // Handle login
//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await loginUser({ username, password });
//       localStorage.setItem("user", JSON.stringify(res.data));
//       navigate("/home");
//     } catch {
//       setError("Invalid username or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Redirect if username not found when focusing password box
//   const handlePasswordFocus = () => {
//     if (usernameExists === false) {
//       navigate("/register", { state: { username } });
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleLogin();
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100vw",
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         overflow: "hidden",
//         background: "linear-gradient(135deg, #1b3672ff 0%, #eaeaf3 100%)",
//       }}
//     >
//       {/* Container */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           width: "100%",
//           height: "100%",
//           maxWidth: 1200,
//           alignItems: "center",
//         }}
//       >
//         {/* Left Image */}
//         <Box
//           sx={{
//             flex: 1,
//             display: { xs: "none", md: "flex" }, // hide on small screens
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100%",
//             ml:10
//           }}
//         >
//           <Box
//             component="img"
//             src="https://scontent.fmaa3-2.fna.fbcdn.net/v/t39.30808-6/482029405_9293251904057799_4287303386032315694_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HQoY1MdNwHgQ7kNvwGy3XG-&_nc_oc=AdmMk_EKAw-EULB6gcDwm27RMExc7OBQDOvxkxqOeDpvuSwUVzHMP-GKdv4C--0ckpQ&_nc_zt=23&_nc_ht=scontent.fmaa3-2.fna&_nc_gid=2iiZ7abYdGzwuvvgRaNHFg&oh=00_AfhftGLUjtdtOYA_mNSocLAptTBdLNqReemwcO1jSaLdNg&oe=691B4FEA"
//             alt="Login Visual"
//             sx={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               borderRadius: 2,
//               boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
//             }}
//           />
//         </Box>

//         {/* Right Login Panel */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             px: { xs: 2, md: 4 },
//             py: { xs: 4, md: 0 },
//             width: "100%",

//           }}
//         >
//           <Fade in timeout={800}>
//             <Paper
//               elevation={5}
//               sx={{
//                 width: "100%",
//                 maxWidth: 400,
//                 borderRadius: 2,
//                 textAlign: "center",
//                 p: 4,
//                 background: "rgba(255,255,255,0.15)",
//                 backdropFilter: "blur(15px)",
//                 boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
//                 overflow: "hidden",
//               }}
//             >
//               <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "#1d1561" }}>
//                 Login
//               </Typography>

//               <TextField
//                 fullWidth
//                 label="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 margin="normal"
//                 sx={{ mb: 1, bgcolor: "white", borderRadius: 1 }}
//               />

//               {usernameExists && (
//                 <Typography variant="body2" color="success.main" align="left">
//                   Username exists
//                 </Typography>
//               )}
//               {usernameExists === false && (
//                 <Typography variant="body2" color="error" align="left">
//                   Username not found*
//                 </Typography>
//               )}

//               <TextField
//                 fullWidth
//                 label="Password"
//                 type="password"
//                 value={password}
//                 onFocus={handlePasswordFocus}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 margin="normal"
//                 sx={{ mb: 1, bgcolor: "white", borderRadius: 1 }}
//               />

//               {error && (
//                 <Typography variant="body2" color="error">
//                   {error}
//                 </Typography>
//               )}

//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={handleLogin}
//                 disabled={loading || usernameExists === false}
//                 sx={{
//                   mt: 3,
//                   borderRadius: 2,
//                   backgroundColor: "#1f3155",
//                   "&:hover": { backgroundColor: "#0042cc" },
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
//               </Button>
//             </Paper>
//           </Fade>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
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
import { loginUser, checkUsernameExists } from "../api/api";

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
    }, 300);
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
      setError("Invalid username or password*" );
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src="https://scontent.fmaa3-2.fna.fbcdn.net/v/t39.30808-6/482029405_9293251904057799_4287303386032315694_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HQoY1MdNwHgQ7kNvwGy3XG-&_nc_oc=AdmMk_EKAw-EULB6gcDwm27RMExc7OBQDOvxkxqOeDpvuSwUVzHMP-GKdv4C--0ckpQ&_nc_zt=23&_nc_ht=scontent.fmaa3-2.fna&_nc_gid=2iiZ7abYdGzwuvvgRaNHFg&oh=00_AfhftGLUjtdtOYA_mNSocLAptTBdLNqReemwcO1jSaLdNg&oe=691B4FEA"
        alt="Background"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.85)", // optional dimming for contrast
        }}
      />

      {/* Glass Login Box */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          height: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in timeout={10}>
          <Paper
            elevation={10}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 3,
              textAlign: "center",
              p: 4,
              background: "rgba(255, 255, 255, 0.2)", // semi-transparent
              backdropFilter: "blur(20px) saturate(160%)", // strong blur + saturation
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.3)", // subtle border
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.36)", // soft shadow
              
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3, color: "#1d1561" }}
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
  bgcolor: "rgba(255, 255, 255, 0.45)",        // semi-transparent background
  borderRadius: 1,
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", // subtle inner shadow
  transition: "all 0.3s ease-in-out",        // smooth hover transition
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.45)",       // brighten a bit on hover
    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.15)", // deeper inner shadow
  }
}}

              />


              {usernameExists === false && (
                <Typography variant="body2" color="error" align="center">
                  Username not found*
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
  mb: 0,
  bgcolor: "rgba(255, 255, 255, 0.45)",        // semi-transparent background
  borderRadius: 1,
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", // subtle inner shadow
  transition: "all 0.3s ease-in-out",        // smooth hover transition
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.45)",       // brighten a bit on hover
    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.15)", // deeper inner shadow
  }
}}

              />

              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                type="submit"
                // disabled={loading || usernameExists === false}
                sx={{
                  mt: 3,
                  borderRadius: 2,
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
