import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { changeUserPassword } from "../api/api"; // your API call

export default function ChangePasswordPage({ user, closeDialog }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await changeUserPassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password changed successfully!");
      closeDialog(); 
    } catch (err) {
      console.error(err);
      alert("Failed to change password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Change Password
          </Typography>
          <TextField
            label="Current Password*"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            fullWidth
          />
          <TextField
            label="New Password*"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Confirm New Password*"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            fullWidth
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button color="error" variant="outlined" onClick={closeDialog}>
              Cancel
            </Button>
            <Button color="success" variant="contained" onClick={handleSave} disabled={loading}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
