// ImagePage.jsx
import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { uploadImageApi, getImageApi } from "../../../api/api";

export default function ImagePage() {
  const [imageId, setImageId] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");

  // ------------------------ UPLOAD IMAGE ------------------------
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFileName(file.name);

    try {
      await uploadImageApi(file);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    }
  };

  // ------------------------ LOAD IMAGE FROM DB ------------------------
  const loadImage = async () => {
    if (!imageId) {
      alert("Enter image ID");
      return;
    }

    try {
      const res = await getImageApi(imageId);

      // Create a Blob and generate URL
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const blobUrl = URL.createObjectURL(blob);
      setPreview(blobUrl);
    } catch (err) {
      console.error("Load image error:", err);
      alert("Failed to load image");
    }
  };

  return (
    <Box sx={{ p: 3, background: "linear-gradient(135deg, #e2eeffff 0%, #87c8eeff 100%)" ,height:"100%"}}>
      <Typography variant="h5" fontWeight="bold" mb={3} color="black">
        Test Image Upload 
      </Typography>

      {/* Upload Input */}
      <Box mb={3}>
        <Button variant="contained" component="label">
          Upload Image
          <input hidden type="file" accept="image/*" onChange={handleUpload} />
        </Button>
        {uploadFileName && (
          <Typography mt={1} color="gray">
            Selected: {uploadFileName}
          </Typography>
        )}
      </Box>

      {/* Load Image */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <TextField
          label="Image ID"
          size="small"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
        />
        <Button variant="contained" onClick={loadImage}>
          Load Image
        </Button>
      </Box>

      {/* Preview */}
      {preview && (
        <Box mt={3}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "440px",height:"290px", borderRadius: "10px" }}
          />
        </Box>
      )}
    </Box>
  );
}
