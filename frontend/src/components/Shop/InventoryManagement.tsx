import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Inventory,
  Add,
  Edit,
  Delete,
  Warning,
  LocalShipping,
  CleaningServices
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ShopInventory, shopOrderService } from '../../services/shopOrderService';

interface InventoryItemProps {
  item: ShopInventory;
  onUpdate: (itemId: string, quantity: number) => void;
  onDelete: (itemId: string) => void;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({ item, onUpdate, onDelete }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newQuantity, setNewQuantity] = useState(item.quantity);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'detergent': return <CleaningServices />;
      case 'equipment': return <Inventory />;
      case 'supplies': return <LocalShipping />;
      case 'tools': return <CleaningServices />;
      default: return <Inventory />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'detergent': return 'primary';
      case 'equipment': return 'secondary';
      case 'supplies': return 'success';
      case 'tools': return 'warning';
      default: return 'default';
    }
  };

  const isLowStock = item.quantity <= item.minQuantity;
  const stockPercentage = (item.quantity / (item.minQuantity * 2)) * 100;

  const handleUpdate = async () => {
    const result = await shopOrderService.updateInventory(item.id, newQuantity);
    if (result.success) {
      onUpdate(item.id, newQuantity);
      setShowEditDialog(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: `${getCategoryColor(item.category)}.light` }}>
                {getCategoryIcon(item.category)}
              </Avatar>
              <Box>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.category} • {item.supplier}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {isLowStock && (
                <Chip
                  icon={<Warning />}
                  label="Low Stock"
                  color="error"
                  size="small"
                />
              )}
              <IconButton onClick={() => setShowEditDialog(true)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(item.id)} color="error">
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Current Stock: {item.quantity} {item.unit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Min Required: {item.minQuantity} {item.unit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(stockPercentage, 100)}
              color={isLowStock ? 'error' : 'primary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Last Restocked: {new Date(item.lastRestocked).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Inventory</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Quantity"
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Minimum Quantity"
            type="number"
            value={item.minQuantity}
            disabled
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

interface InventoryManagerProps {
  inventory: ShopInventory[];
  onInventoryUpdate: (itemId: string, quantity: number) => void;
  onInventoryDelete: (itemId: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onInventoryUpdate,
  onInventoryDelete
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'supplies',
    quantity: 0,
    minQuantity: 0,
    unit: 'pieces',
    supplier: ''
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
  const categories = ['detergent', 'equipment', 'supplies', 'tools'];

  const handleAddItem = () => {
    // This would typically call an API to add a new inventory item
    console.log('Adding new inventory item:', newItem);
    setShowAddDialog(false);
    setNewItem({
      name: '',
      category: 'supplies',
      quantity: 0,
      minQuantity: 0,
      unit: 'pieces',
      supplier: ''
    });
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary">
              {inventory.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Items
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="error">
              {lowStockItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Low Stock
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success">
              {inventory.filter(item => item.quantity > item.minQuantity * 2).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Well Stocked
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info">
              {categories.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categories
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            Low Stock Alert: {lowStockItems.length} items need restocking
          </Typography>
          <Typography variant="body2">
            {lowStockItems.map(item => item.name).join(', ')}
          </Typography>
        </Alert>
      )}

      {/* Add Item Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Inventory Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddDialog(true)}
        >
          Add Item
        </Button>
      </Box>

      {/* Inventory Items */}
      {inventory.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No inventory items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add items to track your cleaning supplies and equipment
          </Typography>
        </Card>
      ) : (
        inventory.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            onUpdate={onInventoryUpdate}
            onDelete={onInventoryDelete}
          />
        ))
      )}

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Current Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Minimum Quantity"
            type="number"
            value={newItem.minQuantity}
            onChange={(e) => setNewItem({ ...newItem, minQuantity: parseInt(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Supplier"
            value={newItem.supplier}
            onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
