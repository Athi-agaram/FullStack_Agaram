import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { editUserProfile } from "../api/api"; // your API call

export default function EditProfilePage({ user,closeDialog }) {
  const [editData, setEditData] = useState({
    username: user?.username || "",
    role: user?.role || "",
    teamName: user?.teamName || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await editUserProfile(user.id, {
        username: editData.username,
        role: editData.role,
        teamName: editData.teamName,
      });
      alert("Profile updated successfully!");
      closeDialog(); // ✅ Close the modal instead of navigating
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>Edit Profile</Typography>
          <TextField
            label="Username"
            value={editData.username}
            onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Role"
            value={editData.role}
            disabled
            fullWidth
          />
          <TextField
            label="Team Name"
            value={editData.teamName}
            onChange={(e) => setEditData(prev => ({ ...prev, teamName: e.target.value }))}
            fullWidth
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button color="error" variant="outlined" onClick={() => closeDialog()}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={handleSave} disabled={loading}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
