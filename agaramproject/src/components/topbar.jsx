// import * as React from "react";
// import {
//   Box,
//   Toolbar,
//   Typography,
//   IconButton,
//   Popper,
//   ClickAwayListener,
//   Paper,
//   MenuList,
//   MenuItem,
//   Divider,
// } from "@mui/material";
// import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
// import { useNavigate } from "react-router-dom";

// // Icons
// import PermIdentitySharpIcon from "@mui/icons-material/PermIdentitySharp";
// import KeySharpIcon from "@mui/icons-material/KeySharp";
// import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";

// const topBarHeight = 60; // slightly taller for better layout
// const drawerWidthCollapsed = 73; // matches your sidebar width

// export default function TopBar({ user }) {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   const handleClick = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   // ✅ Logout handler
//   const handleLogout = () => {
//     // Clear any session info if needed
//     localStorage.clear();
//     sessionStorage.clear();
//     // Navigate to login
//     navigate("/");
//   };

//   const menuItems = [
//     { label: "Edit Profile", icon: <PermIdentitySharpIcon fontSize="small" /> },
//     { label: "Change Password", icon: <KeySharpIcon fontSize="small" /> },
//     {
//       label: "Logout",
//       icon: <LogoutSharpIcon fontSize="small" />,
//       onClick: handleLogout,
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: `${drawerWidthCollapsed}px`, // leave space for sidebar
//         width: `calc(100% - ${drawerWidthCollapsed}px)`,
//         height: `${topBarHeight}px`,
//         backgroundColor: "#ffffff",
//         zIndex: 1300,
//         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//       }}
//     >
//       <Toolbar
//         sx={{
//           justifyContent: "space-between",
//           minHeight: `${topBarHeight}px`,
//           px: 4,
//         }}
//       >
//         {/* Left: Logo */}
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1a237e" }}>
//             Agaram Technologies
//           </Typography>
//         </Box>

//         {/* Right: User Section */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
//             <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#424242" }}>
//               User: {user?.username || "Administrator"}
//             </Typography>
//             <Typography sx={{ fontSize: 12, color: "#757575" }}>
//               Role: {user?.role || "ADMIN"}
//             </Typography>
//           </Box> <br/><br/>

//           <IconButton onClick={handleClick} sx={{ color: "#616161", p: 0.5 }}>
//             <ExpandCircleDownOutlinedIcon />
//           </IconButton>

//           <Popper
//             open={open}
//             anchorEl={anchorEl}
//             placement="bottom-end"
//             style={{ zIndex: 1401, minWidth: 180 }}
//           >
//             <ClickAwayListener onClickAway={handleClose}>
//               <Paper elevation={3}>
//                 <MenuList>
//                   {menuItems.map((item, index) => (
//                     <React.Fragment key={index}>
//                       <MenuItem
//                         onClick={item.onClick || handleClose}
//                         sx={{
//                           fontSize: 13,
//                           color: "#424242",
//                           py: 0.6,
//                           px: 2,
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
//                           {item.label}
//                         </Typography>
//                         <Box sx={{ ml: 2, color: "#1565c0" }}>{item.icon}</Box>
//                       </MenuItem>
//                       {index < menuItems.length - 1 && (
//                         <Divider sx={{ my: 0 }} />
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </MenuList>
//               </Paper>
//             </ClickAwayListener>
//           </Popper>
//         </Box>
//       </Toolbar>
//     </Box>
//   );
// }

// export { topBarHeight, drawerWidthCollapsed };


import * as React from "react";
import { Box, Toolbar, Typography, IconButton, Popper, ClickAwayListener, Paper, MenuList, MenuItem, Divider, Dialog } from "@mui/material";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import PermIdentitySharpIcon from "@mui/icons-material/PermIdentitySharp";
import KeySharpIcon from "@mui/icons-material/KeySharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import EditProfilePage from "../Pages/EditProfile";
import ChangePasswordPage from "../Pages/ChangePassword";
import { useNavigate } from "react-router-dom";

const topBarHeight = 60;
const drawerWidthCollapsed = 73;

export default function TopBar({  user, setMasterTab  }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
    const navigate = useNavigate();


  const [editOpen, setEditOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };
  const menuItems = [
    {
      label: "Edit Profile",
      icon: <PermIdentitySharpIcon fontSize="small" />,
      onClick: () => {
        setEditOpen(true);
        handleCloseMenu();
      },
    },
    {
      label: "Change Password",
      icon: <KeySharpIcon fontSize="small" />,
      onClick: () => {
        setPasswordOpen(true);
        handleCloseMenu();
      },
    },
    {
      label: "Logout",
      icon: <LogoutSharpIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: `${drawerWidthCollapsed}px`,
        width: `calc(100% - ${drawerWidthCollapsed}px)`,
        height: `${topBarHeight}px`,
        backgroundColor: "#ecf1f7ff",
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: `${topBarHeight}px`, px: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1a237e" }}  onClick={() => setMasterTab(null)}>
            Agaram Technologies
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#424242" }}>
              User: {user?.username || "Administrator"}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#757575" }}>
              Role: {user?.role || "ADMIN"}
            </Typography>
          </Box>

          <IconButton onClick={handleClick} sx={{ color: "#616161", p: 0.5 }}>
            <ExpandCircleDownOutlinedIcon />
          </IconButton>

          <Popper open={open} anchorEl={anchorEl} placement="bottom-end" style={{ zIndex: 1401, minWidth: 180 }}>
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <Paper elevation={3}>
                <MenuList>
                  {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <MenuItem
                        onClick={item.onClick}
                        sx={{ fontSize: 13, color: "#424242", py: 0.6, px: 2, justifyContent: "space-between" }}
                      >
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.label}</Typography>
                        <Box sx={{ ml: 2, color: "#1565c0" }}>{item.icon}</Box>
                      </MenuItem>
                      {index < menuItems.length - 1 && <Divider sx={{ my: 0 }} />}
                    </React.Fragment>
                  ))}
                </MenuList>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Toolbar>

      {/* -------------------- Render Edit Profile -------------------- */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <EditProfilePage user={user} closeDialog={() => setEditOpen(false)} />
      </Dialog>

      {/* -------------------- Render Change Password -------------------- */}
      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)} maxWidth="xs" fullWidth>
        <ChangePasswordPage user={user} closeDialog={() => setPasswordOpen(false)} />
      </Dialog>
    </Box>
  );
}

export { topBarHeight, drawerWidthCollapsed };
