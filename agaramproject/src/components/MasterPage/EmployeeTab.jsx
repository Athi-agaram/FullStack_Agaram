import React, { useEffect, useState, useCallback } from "react";
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
  Checkbox,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllUsers,
  getTeamUsers,
  deleteUser,
  updateEmployee,
} from "../../api/api";
import { FormControl, InputLabel } from "@mui/material"; // make sure to import


export default function EmployeeTab({ user }) {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const teamOptions = ["SDMS", "LIMS", "DMS", "ELN"];
  const roleOptions = ["ADMIN", "MANAGER", "EMPLOYEE"];

  // ---------------- LOAD DATA ----------------
  const loadData = useCallback(() => {
    if (!user) return;
    const fetch =
      user.role === "ADMIN" ? getAllUsers : () => getTeamUsers(user.team_name);

    fetch()
      .then((res) => {
        // Map users and add S.No
        let data = (res.data || []).map((u) => ({
          id: u.id,
          username: u.username,
          role: u.role,
          team_name:
            u.team_name && typeof u.team_name === "object"
              ? u.team_name.team_name
              : u.team_name || "-",
          authorized: !!u.authorized,
        }));

        // ----------- SORTING LOGIC -----------
        // 1️⃣ Admin first
        // 2️⃣ Unauthorized next
        // 3️⃣ Authorized last
        data.sort((a, b) => {
          if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
          if (b.role === "ADMIN" && a.role !== "ADMIN") return 1;
          if (!a.authorized && b.authorized) return -1;
          if (a.authorized && !b.authorized) return 1;
          return a.id - b.id;
        });

        // Add S.No after sorting
        data = data.map((u, index) => ({ ...u, sno: index + 1 }));

        setRows(data);
      })
      .catch(() => setRows([]));
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------- ACCESS CONTROL ----------------
  const canEditOrDelete = (row) => {
    if (row.role === "ADMIN") return false; // No edit/delete for admin
    if (user.role === "ADMIN") return true; // Admin can edit/delete anyone else
    if (user.role === "MANAGER") return row.team_name === user.team_name;
    return false;
  };

  // ---------------- EDIT ----------------
  const handleEdit = (row) => {
    if (!canEditOrDelete(row)) return;
    setSelectedUser({ ...row });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleSaveChanges = async () => {
    try {
      const { id, role, team_name, authorized } = selectedUser;
      await updateEmployee(
        id,
        { role, teamName: team_name, authorized },
        user.username
      );
      alert("Changes saved successfully!");
      handleCloseDialog();
      loadData(); // reload to reposition users
    } catch (err) {
      alert(err.response?.data || err.message || "Failed to update user");
    }
  };

  // ---------------- DELETE ----------------
const handleDelete = async (row) => {
  if (!canEditOrDelete(row)) return;

  if (row.authorized) {
    alert("This user is authorized. Please unauthorize the user before deleting.");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    await deleteUser(row.id, user.username);
    alert("User deleted successfully");
    loadData();
  } catch (err) {
    alert(err.response?.data || err.message || "Failed to delete user");
  }
};


  // ---------------- COLUMNS ----------------
  const columns = [
    { field: "sno", headerName: "S.No", width: 100 },
    { field: "id", headerName: "ID", width: 170 , renderCell: (params) => `E0${params.value}`},
    { field: "username", headerName: "Username", width: 240 },
    { field: "role", headerName: "Role", width: 233 },
    { field: "team_name", headerName: "Team Name", width: 200 },
    {
      field: "authorized",
      headerName: "Authorized",
      width: 190,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            disabled={!canEditOrDelete(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
            disabled={!canEditOrDelete(params.row)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // ---------------- UI ----------------
  return (
    <Box sx={{ height: "474px", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[7, 14]}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 7 } } }}
        pagination
        disableRowSelectionOnClick
          sx={{
    border: 0,
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
        componentsProps={{ pagination: { sx: { justifyContent: "flex-start", paddingLeft: 20 } } }}
      />

      {/* ---------------- EDIT DIALOG ---------------- */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
  <DialogTitle>Edit Employee</DialogTitle>
  <DialogContent dividers>
    {selectedUser && (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {/* Username */}
        <TextField
          label="Username"
          value={selectedUser.username}
          disabled
          fullWidth
        />

        {/* Role */}
        <FormControl fullWidth>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            value={selectedUser.role || ""}
            label="Role"
            onChange={(e) =>
              setSelectedUser((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            {roleOptions.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Team Name */}
        <FormControl fullWidth>
          <InputLabel id="team-label">Team Name</InputLabel>
          <Select
            labelId="team-label"
            value={selectedUser.team_name || ""}
            label="Team Name"
            onChange={(e) =>
              setSelectedUser((prev) => ({ ...prev, team_name: e.target.value }))
            }
          >
            {teamOptions.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Authorized */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={!!selectedUser.authorized}
            onChange={(e) =>
              setSelectedUser((prev) => ({
                ...prev,
                authorized: e.target.checked,
              }))
            }
          />
          <Typography>Authorized</Typography>
        </Box>
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseDialog} color="error" variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleSaveChanges} color="success" variant="contained">
      Save
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}
