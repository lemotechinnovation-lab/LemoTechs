import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Star, Schedule } from '@mui/icons-material';

interface SmartSuggestion {
  id: string;
  type: 'popular' | 'bundle' | 'time' | 'seasonal';
  title: string;
  description: string;
  items: string[];
  discount?: number;
  icon: React.ReactNode;
  color: string;
}

interface SmartSuggestionsProps {
  location?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  onSuggestionSelect: (suggestion: SmartSuggestion) => void;
}

const generateSuggestions = (location: string, timeOfDay: string): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [
    {
      id: 'business-bundle',
      type: 'popular',
      title: 'Business Professional',
      description: 'Perfect for office wear',
      items: ['suit', 'dress-shoes', 'shirt'],
      discount: 15,
      icon: <Star />,
      color: '#FF6B35'
    },
    {
      id: 'weekend-casual',
      type: 'bundle',
      title: 'Weekend Refresh',
      description: 'Get ready for the weekend',
      items: ['sneakers', 'jacket', 'bag'],
      discount: 10,
      icon: <TrendingUp />,
      color: '#4CAF50'
    },
    {
      id: 'quick-clean',
      type: 'time',
      title: 'Express Service',
      description: 'Same-day cleaning available',
      items: ['shirt', 'sneakers'],
      icon: <Schedule />,
      color: '#2196F3'
    }
  ];

  // Smart filtering based on context
  if (location.toLowerCase().includes('sandton') || location.toLowerCase().includes('rosebank')) {
    // Business district - prioritize professional items
    suggestions[0].title = '🏢 Sandton Business Special';
    suggestions[0].discount = 20;
  }

  if (timeOfDay === 'evening') {
    suggestions.push({
      id: 'next-day',
      type: 'time',
      title: 'Tomorrow Morning Pickup',
      description: 'Schedule for early pickup',
      items: ['suit', 'shirt'],
      icon: <Schedule />,
      color: '#9C27B0'
    });
  }

  return suggestions;
};

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  location = '',
  timeOfDay,
  onSuggestionSelect
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (location) {
      const newSuggestions = generateSuggestions(location, timeOfDay);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    }
  }, [location, timeOfDay]);

  return (
    <AnimatePresence>
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lightbulb sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                Smart Suggestions
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      minWidth: 200,
                      bgcolor: alpha(suggestion.color, 0.1),
                      border: `1px solid ${alpha(suggestion.color, 0.3)}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${alpha(suggestion.color, 0.3)}`
                      }
                    }}
                    onClick={() => onSuggestionSelect(suggestion)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: suggestion.color,
                            width: 32,
                            height: 32,
                            mr: 1
                          }}
                        >
                          {suggestion.icon}
                        </Avatar>
                        {suggestion.discount && (
                          <Chip
                            label={`${suggestion.discount}% OFF`}
                            size="small"
                            sx={{
                              bgcolor: suggestion.color,
                              color: 'white',
                              fontSize: '0.7rem',
                              ml: 'auto'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        {suggestion.title}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        {suggestion.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {suggestion.items.slice(0, 3).map((item, idx) => (
                          <Chip
                            key={idx}
                            label={item.replace('-', ' ')}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {suggestion.items.length > 3 && (
                          <Chip
                            label={`+${suggestion.items.length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
