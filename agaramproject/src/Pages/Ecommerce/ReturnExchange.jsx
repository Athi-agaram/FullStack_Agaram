import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { createReturnExchangeApi, getStoreProducts } from "../../api/api";

export default function ReturnExchangeDialog({
  open,
  type,
  onClose,
  filteredOrders,
  user,
  username,
  formatCurrency,
  onSuccess,
}) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState('');
  const [images, setImages] = useState([]);
  const [exchangeProducts, setExchangeProducts] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (open && type === 'EXCHANGE') {
      fetchProducts();
    }
  }, [open, type]);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setSelectedOrderId('');
      setSelectedItems({});
      setReason('');
      setImages([]);
      setExchangeProducts({});
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const res = await getStoreProducts();
      setProducts(res.data || []);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Each image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          data: event.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedOrderId) {
      alert("Please select an order");
      return;
    }

    const selectedItemsList = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (selectedItemsList.length === 0) {
      alert("Please select at least one item");
      return;
    }

    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    if (type === 'EXCHANGE') {
      const missingExchange = selectedItemsList.find(itemId => !exchangeProducts[itemId]);
      if (missingExchange) {
        alert("Please select exchange products for all selected items");
        return;
      }
    }

    try {
      const order = filteredOrders.find(o => o.id === parseInt(selectedOrderId));
      
      const requestData = {
        orderId: parseInt(selectedOrderId),
        userId: user.id,
        username: username,
        type: type,
        reason: reason.trim(),
        items: selectedItemsList.map(itemId => {
          const item = order.items.find(i => i.id === parseInt(itemId));
          return {
            orderItemId: item.order_item_id || item.id,
            productId: item.id,
            productName: item.name,
            qty: item.qty,
            price: item.price,
            exchangeProductId: type === 'EXCHANGE' ? exchangeProducts[itemId]?.id : null,
            exchangeProductName: type === 'EXCHANGE' ? exchangeProducts[itemId]?.name : null,
          };
        }),
        images: images.map(img => img.data)
      };

      const res = await createReturnExchangeApi(requestData);

      if (res.data?.success) {
        alert(`${type} request submitted successfully! Admin will review your request.`);
        onClose();
        onSuccess();
      } else {
        alert('Failed to submit request: ' + (res.data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error submitting return/exchange:', err);
      alert('Failed to submit request: ' + (err.response?.data?.message || err.message));
    }
  };

  const deliveredOrders = filteredOrders.filter(order => order.status === 'DELIVERED');
  const selectedOrder = deliveredOrders.find(o => o.id === parseInt(selectedOrderId));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Request {type === 'RETURN' ? 'Return' : 'Exchange'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#1976d2' }}>
            Select Order (Only delivered orders eligible)
          </Typography>
          <TextField
            select
            fullWidth
            value={selectedOrderId}
            onChange={(e) => {
              setSelectedOrderId(e.target.value);
              setSelectedItems({});
              setExchangeProducts({});
            }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">-- Select Order --</option>
            {deliveredOrders.map(order => (
              <option key={order.id} value={order.id}>
                Order #{order.id} - {new Date(order.created_at).toLocaleDateString()} - {formatCurrency(order.total_amount)}
              </option>
            ))}
          </TextField>
        </Box>

        {/* Step 2: Select Items */}
        {selectedOrderId && selectedOrder && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#1976d2' }}>
              Select Items ({Object.values(selectedItems).filter(Boolean).length} selected)
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
              {selectedOrder.items.map(item => (
                <Paper key={item.id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Checkbox
                    checked={selectedItems[item.id] || false}
                    onChange={() => setSelectedItems(prev => ({
                      ...prev,
                      [item.id]: !prev[item.id]
                    }))}
                  />
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 4 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.qty} | {formatCurrency(item.price)}
                    </Typography>
                  </Box>
                  {type === 'EXCHANGE' && selectedItems[item.id] && (
                    <Box>
                      {exchangeProducts[item.id] ? (
                        <Chip
                          label={`Exchange: ${exchangeProducts[item.id].name}`}
                          onDelete={() => setExchangeProducts(prev => {
                            const newProds = {...prev};
                            delete newProds[item.id];
                            return newProds;
                          })}
                          color="success"
                        />
                      ) : (
                        <TextField
                          select
                          size="small"
                          onChange={(e) => {
                            const product = products.find(p => p.id === parseInt(e.target.value));
                            if (product) {
                              setExchangeProducts(prev => ({
                                ...prev,
                                [item.id]: product
                              }));
                            }
                          }}
                          SelectProps={{ native: true }}
                          sx={{ minWidth: 150 }}
                        >
                          <option value="">Select...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </TextField>
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Step 3: Reason */}
        {Object.values(selectedItems).filter(Boolean).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#1976d2' }}>
              Provide Reason
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for Return/Exchange"
              placeholder="Please describe the issue with the product(s)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Box>
        )}

        {/* Step 4: Upload Images */}
        {reason.trim() && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#1976d2' }}>
              Upload Images (Required - Max 5MB each)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <Paper key={index} sx={{ p: 1, position: 'relative', width: 120 }}>
                  <img
                    src={image.data}
                    alt={`Upload ${index + 1}`}
                    style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'white' }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !selectedOrderId ||
            Object.values(selectedItems).filter(Boolean).length === 0 ||
            !reason.trim() ||
            images.length === 0
          }
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}