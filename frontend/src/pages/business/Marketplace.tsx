// React and React-related imports
import React, { useState, useEffect } from 'react';

// Third-party libraries
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { revenueService } from '../../services/revenueService';
import { MarketplaceProduct } from '../../types/revenue';

interface CartItem extends MarketplaceProduct {
  quantity: number;
}

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MarketplaceProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'reviews'>('rating');

  const categories = [
    { id: 'all', name: 'All Products', count: 0 },
    { id: 'detergent', name: 'Detergents', count: 0 },
    { id: 'fabric_care', name: 'Fabric Care', count: 0 },
    { id: 'stain_removal', name: 'Stain Removal', count: 0 },
    { id: 'accessories', name: 'Accessories', count: 0 },
    { id: 'equipment', name: 'Equipment', count: 0 }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, activeTab, priceRange, selectedBrands, sortBy]);

  const loadProducts = async () => {
    try {
      const allProducts = await revenueService.getMarketplaceProducts();
      setProducts(allProducts);
      
      // Update category counts
      categories.forEach(cat => {
        if (cat.id === 'all') {
          cat.count = allProducts.length;
        } else {
          cat.count = allProducts.filter(p => p.category === cat.id).length;
        }
      });
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (activeTab > 0) {
      const selectedCategory = categories[activeTab].id;
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const addToCart = (product: MarketplaceProduct, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };



  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };


  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const brands = Array.from(new Set(products.map(p => p.brand)));

  const ProductCard = ({ product }: { product: MarketplaceProduct }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: product.isRecommended ? '2px solid #FF6B35' : 'none'
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.images[0]}
            alt={product.name}
            sx={{ cursor: 'pointer' }}
            onClick={() => setSelectedProduct(product)}
          />
          
          {product.isRecommended && (
            <Chip
              label="RECOMMENDED"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}

          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: favorites.includes(product.id) ? '#FF6B35' : 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
            }}
            onClick={() => toggleFavorite(product.id)}
          >
            {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            {product.name}
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            by {product.brand}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} readOnly size="small" />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
              ({product.reviews})
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            mb: 2,
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              R{product.price.toFixed(2)}
            </Typography>
            <Chip
              label={`${product.margin.toFixed(0)}% margin`}
              size="small"
              sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            sx={{
              background: product.inStock 
                ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                : 'rgba(255,255,255,0.1)',
              color: product.inStock ? 'white' : 'rgba(255,255,255,0.5)',
              '&:hover': product.inStock ? {
                background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
              } : {}
            }}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FilterDrawer = () => (
    <Drawer
      anchor="right"
      open={showFilters}
      onClose={() => setShowFilters(false)}
      PaperProps={{
        sx: {
          width: 350,
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
          Filters
        </Typography>

        {/* Price Range */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Price Range
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={200}
            sx={{
              color: '#FF6B35',
              '& .MuiSlider-thumb': {
                backgroundColor: '#FF6B35'
              },
              '& .MuiSlider-track': {
                backgroundColor: '#FF6B35'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              R{priceRange[0]}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              R{priceRange[1]}
            </Typography>
          </Box>
        </Box>

        {/* Brands */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Brands
          </Typography>
          <FormGroup>
            {brands.map(brand => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(selectedBrands.filter(b => b !== brand));
                      }
                    }}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-checked': { color: '#FF6B35' }
                    }}
                  />
                }
                label={brand}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Sort By */}
        <Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Sort By
          </Typography>
          <List>
            {[
              { key: 'rating', label: 'Rating' },
              { key: 'price', label: 'Price' },
              { key: 'reviews', label: 'Reviews' }
            ].map(option => (
              <ListItem
                key={option.key}
                button
                selected={sortBy === option.key}
                onClick={() => setSortBy(option.key as any)}
                sx={{
                  color: sortBy === option.key ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)'
                  }
                }}
              >
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 10
    }}>
      <ParticleBackground />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              LemoTech Marketplace
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4
              }}
            >
              Premium cleaning products & accessories
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>

            <Badge badgeContent={getTotalCartItems()} color="primary">
              <IconButton
                sx={{
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF6B35',
                  '&:hover': { backgroundColor: 'rgba(255, 107, 53, 0.2)' }
                }}
              >
                <ShoppingCart />
              </IconButton>
            </Badge>
          </Box>

          {/* Search and Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(true)}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  borderColor: '#FF6B35',
                  color: '#FF6B35'
                }
              }}
            >
              Filters
            </Button>
          </Box>

          {/* Category Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': {
                    color: '#FF6B35'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FF6B35'
                }
              }}
            >
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  label={`${category.name} (${category.count})`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No products found matching your criteria
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>

      <FilterDrawer />

      {/* Product Detail Dialog */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                {selectedProduct.name}
                {selectedProduct.isRecommended && (
                  <Chip
                    label="RECOMMENDED"
                    size="small"
                    sx={{
                      ml: 2,
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      color: 'white'
                    }}
                  />
                )}
              </Box>
              <IconButton
                onClick={() => toggleFavorite(selectedProduct.id)}
                sx={{ color: favorites.includes(selectedProduct.id) ? '#FF6B35' : 'rgba(255,255,255,0.7)' }}
              >
                {favorites.includes(selectedProduct.id) ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    by {selectedProduct.brand}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={selectedProduct.rating} readOnly />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                      {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </Typography>
                  </Box>

                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 2 }}>
                    R{selectedProduct.price.toFixed(2)}
                  </Typography>

                  <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                    {selectedProduct.description}
                  </Typography>

                  <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Specifications
                  </Typography>
                  {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {key}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedProduct(null)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={!selectedProduct.inStock}
                sx={{
                  background: selectedProduct.inStock 
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : 'rgba(255,255,255,0.1)',
                  '&:hover': selectedProduct.inStock ? {
                    background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                  } : {}
                }}
              >
                {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

