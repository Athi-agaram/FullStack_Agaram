// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { registerUser } from "../api/api";
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Stack,
//   Fade,
//   CircularProgress,
// } from "@mui/material";

// export default function RegisterPage() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Get username passed from LoginPage (if any)
//   const prefilledUsername = location.state?.username || "";

//   const [username, setUsername] = useState(prefilledUsername);
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Ensure prefill works when page loads
//   useEffect(() => {
//     if (prefilledUsername) setUsername(prefilledUsername);
//   }, [prefilledUsername]);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!username || !password || !confirm)
//       return alert("All fields are required");
//     if (password !== confirm) return alert("Passwords do not match");

//     try {
//       setLoading(true);
//       const res = await registerUser({ username, password });

//       if (res.data.includes("successfully")) {
//         localStorage.setItem("recentlyRegisteredUsername", username);
//         alert("Registration successful! Please login.");
//         navigate("/");
//       } else {
//         alert(res.data || "Registration failed");
//       }
//     } catch (err) {
//       alert(err?.response?.data || "Registration failed due to server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #08193dff 0%, #bfbfdaff 100%)",
//         padding: 4,
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
//           alt="Register Visual"
//           sx={{
//             width: "100%",
//             height: "100%",
//             borderRadius: "10px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
//           }}
//         />
//       </Box>

//       {/* Right Register Panel (same layout as Login) */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Fade in timeout={80}>
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
//               Register
//             </Typography>

//             <Box component="form" onSubmit={handleRegister} noValidate>
//               {/* Username (readonly) */}
//               <TextField
//                 fullWidth
//                 placeholder="Username"
//                 margin="normal"
//                 value={username}
//                 InputProps={{
//                   readOnly: true,
//                   sx: {
//                     bgcolor: "#e0e0e0ff",
//                     borderRadius: 1,
//                   },
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "grey" },
//                     "&:hover fieldset": { borderColor: "black" },
//                     "&.Mui-focused fieldset": { borderColor: "grey" },
//                   },
//                   "& .MuiInputLabel-root": { color: "black" },
//                   "& .MuiInputLabel-root.Mui-focused": { color: "black" },
//                 }}
//               />

//               {/* Password */}
//               <TextField
//                 fullWidth
//                 placeholder="Password"
//                 type="password"
//                 margin="normal"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 sx={{
//                   bgcolor: "rgba(255,255,255,1)",
//                   borderRadius: 1,
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "grey" },
//                     "&:hover fieldset": { borderColor: "black" },
//                     "&.Mui-focused fieldset": { borderColor: "grey" },
//                   },
//                   "& .MuiInputLabel-root": { color: "grey" },
//                   "& .MuiInputLabel-root.Mui-focused": { color: "black" },
//                 }}
//               />

//               {/* Confirm Password */}
//               <TextField
//                 fullWidth
//                 placeholder="Confirm Password"
//                 type="password"
//                 margin="normal"
//                 value={confirm}
//                 onChange={(e) => setConfirm(e.target.value)}
//                 required
//                 sx={{
//                   bgcolor: "rgba(255,255,255,1)",
//                   borderRadius: 1,
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "grey" },
//                     "&:hover fieldset": { borderColor: "black" },
//                     "&.Mui-focused fieldset": { borderColor: "grey" },
//                   },
//                   "& .MuiInputLabel-root": { color: "grey" },
//                   "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                  
//                 }}
//               />

//               {/* Buttons */}
//               <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   type="submit"
//                   disabled={loading}
//                   sx={{
//                     borderRadius: 2,
//                     backgroundColor: "#1f3155ff",
//                     "&:hover": { backgroundColor: "#0042cc" },
//                   }}
//                 >
//                   {loading ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : (
//                     "Register"
//                   )}
//                 </Button>

//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   onClick={() => navigate("/")}
//                   sx={{
//                     borderRadius: 2,
//                     bgcolor: "#962424ff",
//                     color: "#ffffff",
//                     border: "none",
//                     boxShadow: "2",
//                     "&:hover": { bgcolor: "#d94b4b" },
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </Stack>
//             </Box>
//           </Paper>
//         </Fade>
//       </Box>
//     </Box>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../api/api";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Fade,
  Stack,
  CircularProgress,
} from "@mui/material";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledUsername = location.state?.username || "";

  const [username, setUsername] = useState(prefilledUsername);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledUsername) setUsername(prefilledUsername);
  }, [prefilledUsername]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirm)
      return alert("All fields are required");
    if (password !== confirm) return alert("Passwords do not match");

    try {
      setLoading(true);
      const res = await registerUser({ username, password });

      if (res.data.includes("successfully")) {
        localStorage.setItem("recentlyRegisteredUsername", username);
        alert("Registration successful! Please login.");
        navigate("/");
      } else {
        alert(res.data || "Registration failed");
      }
    } catch (err) {
      alert(err?.response?.data || "Registration failed due to server error");
    } finally {
      setLoading(false);
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
          filter: "brightness(0.85)",
        }}
      />

      {/* Glass Register Box */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          height: "65%",
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
              sx={{ mb: 3, color: "#1d1561" }}
            >
              Register
            </Typography>

            <form onSubmit={handleRegister}>
              {/* Username Field (Locked) */}
              <TextField
                fullWidth
                label="Username"
                value={username}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.45)",
                  borderRadius: 1,
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.45)",
                  borderRadius: 1,
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.45)",
                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.15)",
                  },
                }}
              />

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                margin="normal"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.45)",
                  borderRadius: 1,
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.45)",
                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.15)",
                  },
                }}
              />

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#1f3155",
                    "&:hover": { backgroundColor: "#0042cc" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#962424",
                    color: "#ffffff",
                    border: "none",
                    "&:hover": { bgcolor: "#d94b4b" },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}
