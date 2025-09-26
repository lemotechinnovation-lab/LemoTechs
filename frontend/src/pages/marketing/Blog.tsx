import { useState } from 'react';
import { Typography, Container, Box, Card, Button, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '../../components/Common';
import { 
  AccessTime,
  Visibility
} from '@mui/icons-material';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishDate: Date;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  image: string;
}

type BlogCategory = 'All' | 'Cleaning Tips' | 'Technology' | 'Sustainability' | 'Customer Stories' | 'Industry Insights';

export const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories: BlogCategory[] = ['All', 'Cleaning Tips', 'Technology', 'Sustainability', 'Customer Stories', 'Industry Insights'];

  const blogPosts: BlogPost[] = [
    {
      id: 'stain-removal-science',
      title: 'The Science Behind Professional Stain Removal',
      excerpt: 'Discover how our professional-grade cleaning processes tackle even the toughest stains using advanced chemistry and proven techniques.',
      content: `# The Science Behind Professional Stain Removal

When you spill red wine on your favorite white shirt or step in mud with your premium leather shoes, it might seem like the end of the world. But at LemoTech, we see it as just another day at the office. Here's the fascinating science behind how we make the impossible possible.

## Understanding Stain Chemistry

Every stain has a unique molecular structure that determines how it bonds with fabric fibers. Our cleaning specialists are trained to identify:

- **Protein-based stains** (blood, sweat, food) - require enzymatic breakdown
- **Oil-based stains** (grease, makeup) - need surfactant action
- **Tannin stains** (wine, coffee, tea) - require pH adjustment
- **Dye stains** (ink, marker) - need solvent extraction

## Our Professional Process

1. **Stain Analysis**: We identify the stain type and age
2. **Pre-treatment**: Apply targeted cleaning agents
3. **Temperature Control**: Use optimal heat for stain breakdown
4. **Mechanical Action**: Controlled agitation without damage
5. **Rinse and Neutralize**: Remove all cleaning residues

## Why DIY Often Fails

Home remedies can actually set stains permanently by:
- Using incorrect pH levels
- Applying heat to protein stains
- Not neutralizing cleaning agents
- Rubbing instead of blotting

## The LemoTech Advantage

Our professional equipment and training mean we can save items that seem hopeless. We've successfully removed:
- 3-year-old wine stains from silk dresses
- Oil stains from suede jackets
- Ink stains from leather handbags
- Blood stains from white cotton shirts

*Ready to see the science in action? Book your cleaning service today and watch us work magic on your toughest stains.*`,
      author: {
        name: 'Dr. Sarah Mitchell',
        avatar: '👩‍🔬',
        role: 'Head of Cleaning Sciences'
      },
      publishDate: new Date('2024-01-15'),
      readTime: 5,
      category: 'Cleaning Tips',
      tags: ['Stain Removal', 'Science', 'Professional Cleaning', 'Chemistry'],
      featured: true,
      views: 2847,
      image: '/assets/stain-science.jpg'
    },
    {
      id: 'sustainable-cleaning',
      title: 'How LemoTech is Revolutionizing Eco-Friendly Cleaning',
      excerpt: 'Learn about our commitment to environmental sustainability and how we deliver premium cleaning results while protecting our planet.',
      content: `# How LemoTech is Revolutionizing Eco-Friendly Cleaning

In an era where environmental consciousness is more important than ever, LemoTech is leading the charge in sustainable cleaning practices. We prove that you don't have to choose between premium quality and environmental responsibility.

## Our Eco-Friendly Approach

### Biodegradable Detergents
We use only plant-based, biodegradable cleaning agents that:
- Break down naturally within 28 days
- Don't harm aquatic ecosystems
- Are safe for sensitive skin
- Deliver superior cleaning power

### Water Conservation
Our advanced cleaning systems reduce water usage by 40% compared to traditional methods:
- Closed-loop water recycling
- High-efficiency extraction systems
- Precise water-to-detergent ratios
- Steam cleaning for minimal water use

### Energy Efficiency
- Solar-powered facilities where possible
- Energy-efficient equipment
- Optimized delivery routes to reduce carbon footprint
- LED lighting throughout our facilities

## Environmental Impact

Since launching our eco-friendly initiatives:
- **50,000 liters** of water saved annually
- **2.3 tons** of CO2 emissions prevented
- **100%** biodegradable cleaning products
- **Zero** harmful chemicals released into waterways

## Customer Benefits

Choosing eco-friendly cleaning doesn't mean compromising on results:
- Gentler on fabrics = longer-lasting clothes
- No chemical residues = better for sensitive skin
- Fresh, natural scents without artificial fragrances
- Peace of mind knowing you're helping the planet

## The Future of Cleaning

We're constantly innovating:
- Developing new plant-based cleaning compounds
- Investing in renewable energy sources
- Researching zero-waste cleaning processes
- Partnering with environmental organizations

*Join us in making a difference. Every item you clean with LemoTech is a step toward a more sustainable future.*`,
      author: {
        name: 'Michael Green',
        avatar: '🌱',
        role: 'Sustainability Director'
      },
      publishDate: new Date('2024-01-10'),
      readTime: 4,
      category: 'Sustainability',
      tags: ['Eco-Friendly', 'Sustainability', 'Environment', 'Green Cleaning'],
      featured: true,
      views: 1923,
      image: '/assets/eco-cleaning.jpg'
    },
    {
      id: 'time-management-study',
      title: '5 Hours Back: How LemoTech Customers Reclaim Their Week',
      excerpt: 'Our recent study reveals how our customers use the time saved from outsourcing their cleaning to pursue what matters most.',
      content: `# 5 Hours Back: How LemoTech Customers Reclaim Their Week

We surveyed 500 LemoTech customers to understand how they use the time saved from outsourcing their cleaning. The results were inspiring and show the true value of convenience services.

## The Time-Saving Reality

### Average Time Saved Per Week:
- **Laundry**: 2.5 hours
- **Shoe cleaning**: 45 minutes  
- **Dry cleaning trips**: 1.5 hours
- **Waiting and sorting**: 30 minutes
- **Total**: **5.25 hours per week**

## How Customers Spend Their Reclaimed Time

### Top Activities (% of respondents):
1. **Family time** - 67%
2. **Exercise and fitness** - 45%
3. **Pursuing hobbies** - 38%
4. **Career development** - 31%
5. **Rest and relaxation** - 56%
6. **Social activities** - 29%

## Real Customer Stories

### Sarah, Marketing Executive
*"Those 5 hours back mean I can attend my daughter's soccer games every Saturday. Priceless."*

### James, Entrepreneur  
*"I use the time saved to work on my side business. LemoTech literally helped me launch my startup."*

### Maria, Teacher
*"Finally have time for yoga classes and reading. My stress levels have dropped significantly."*

## The Productivity Multiplier Effect

Customers report additional benefits:
- **78%** feel less stressed about household chores
- **65%** have improved work-life balance
- **52%** have taken on new hobbies or activities
- **43%** spend more quality time with family

## Economic Value of Time

Based on average South African salaries:
- 5.25 hours/week = 273 hours/year
- At R150/hour average = **R40,950 value per year**
- LemoTech annual cost: ~R9,600
- **Net value created: R31,350**

## The Bigger Picture

Time is our most precious resource. By handling your cleaning needs, we don't just clean your clothes – we clean up your schedule, reduce your stress, and give you the freedom to focus on what truly matters.

*Ready to reclaim your 5 hours? Start your LemoTech journey today.*`,
      author: {
        name: 'Dr. Amanda Clarke',
        avatar: '📊',
        role: 'Customer Research Lead'
      },
      publishDate: new Date('2024-01-08'),
      readTime: 6,
      category: 'Industry Insights',
      tags: ['Time Management', 'Productivity', 'Customer Research', 'Lifestyle'],
      featured: false,
      views: 3156,
      image: '/assets/time-study.jpg'
    },
    {
      id: 'tech-behind-tracking',
      title: 'The Technology Behind Real-Time Order Tracking',
      excerpt: 'Ever wondered how we provide Uber-like tracking for your cleaning orders? Dive into the technology that makes it all possible.',
      content: `# The Technology Behind Real-Time Order Tracking

At LemoTech, we believe transparency builds trust. That's why we've invested heavily in technology that gives you complete visibility into your cleaning journey – from pickup to delivery.

## Our Tech Stack

### GPS and Location Services
- Real-time driver location tracking
- Optimized route planning
- Geofenced pickup/delivery zones
- ETA calculations with traffic data

### Mobile Applications
- Native iOS and Android apps
- Progressive Web App (PWA) for universal access
- Push notifications for status updates
- Offline capability for drivers

### Backend Infrastructure
- Cloud-based microservices architecture
- Real-time WebSocket connections
- Automated status updates
- Scalable database systems

## The Journey Tracking Process

### 1. Order Placement
- Instant order confirmation
- Driver assignment algorithm
- Route optimization begins

### 2. Pickup Phase
- Driver en-route notifications
- Live location sharing
- Photo confirmation of items
- Digital receipt generation

### 3. Cleaning Phase
- Facility check-in notifications
- Cleaning progress updates
- Quality control checkpoints
- Completion notifications

### 4. Delivery Phase
- Out-for-delivery alerts
- Live delivery tracking
- Photo proof of delivery
- Customer satisfaction survey

## Advanced Features

### Predictive Analytics
- Machine learning for ETA accuracy
- Demand forecasting
- Optimal driver allocation
- Service time predictions

### Customer Communication
- Automated SMS and email updates
- In-app messaging with drivers
- Real-time customer support chat
- Multilingual support

### Quality Assurance
- Digital photo documentation
- Barcode tracking for items
- Quality control checkpoints
- Customer feedback integration

## Security and Privacy

We take data protection seriously:
- End-to-end encryption
- GDPR and POPIA compliance
- Secure payment processing
- Regular security audits

## The Result

Our customers enjoy:
- **99.2%** tracking accuracy
- **<30 second** average update delays
- **24/7** real-time visibility
- **Zero** lost items in 2023

## What's Next?

We're constantly innovating:
- AI-powered cleaning recommendations
- IoT sensors for facility monitoring
- Blockchain for supply chain transparency
- Augmented reality for damage assessment

*Experience the future of cleaning services. Book with LemoTech and see technology in action.*`,
      author: {
        name: 'Alex Chen',
        avatar: '👨‍💻',
        role: 'Head of Technology'
      },
      publishDate: new Date('2024-01-05'),
      readTime: 7,
      category: 'Technology',
      tags: ['Technology', 'Tracking', 'Innovation', 'Mobile App'],
      featured: false,
      views: 1687,
      image: '/assets/tech-tracking.jpg'
    }
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  if (selectedPost) {
    return (
      <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <ParticleBackground />
        <Container maxWidth="md" sx={{ pt: 12, pb: 8, position: 'relative', zIndex: 1 }}>
          <Button 
            onClick={() => setSelectedPost(null)}
            sx={{ mb: 3, color: 'white' }}
          >
            ← Back to Blog
          </Button>
          
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h1" sx={{ 
              color: 'white', 
              mb: 2,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600
            }}>
              {selectedPost.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {selectedPost.author.avatar}
              </Avatar>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  {selectedPost.author.name}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  {selectedPost.author.role} • {selectedPost.readTime} min read
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: 1.7,
              '& h1, & h2, & h3': { 
                color: 'white', 
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mt: 3, 
                mb: 2 
              },
              '& p': { mb: 2 },
              '& ul, & ol': { pl: 3, mb: 2 },
              '& strong': { color: 'white', fontWeight: 600 }
            }}>
              {selectedPost.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <Typography key={index} variant="h2" sx={{ 
                      color: 'white', 
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      mt: 4, 
                      mb: 2 
                    }}>
                      {paragraph.replace('# ', '')}
                    </Typography>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <Typography key={index} variant="h3" sx={{ 
                      color: 'white', 
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 500,
                      mt: 3, 
                      mb: 2 
                    }}>
                      {paragraph.replace('## ', '')}
                    </Typography>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <Typography key={index} variant="h4" sx={{ 
                      color: 'white', 
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 500,
                      mt: 2, 
                      mb: 1 
                    }}>
                      {paragraph.replace('### ', '')}
                    </Typography>
                  );
                }
                if (paragraph.trim() === '') return null;
                
                return (
                  <Typography key={index} sx={{ 
                    mb: 2, 
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {paragraph}
                  </Typography>
                );
              })}
            </Box>

            <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedPost.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,107,53,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,107,53,0.3)'
                    }}
                  />
                ))}
              </Box>
            </Box>
          </motion.article>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <ParticleBackground />
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8, position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 600,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LemoTech Insights
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)',
              mb: 6,
              fontFamily: '"Inter", sans-serif',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover the science, technology, and stories behind modern cleaning services
          </Typography>
        </motion.div>

        {/* Category Filter */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '800px'
          }}>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  color: selectedCategory === category ? 'white' : 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(255,107,53,0.5)',
                  bgcolor: selectedCategory === category ? 'primary.main' : 'transparent',
                  '&:hover': {
                    bgcolor: selectedCategory === category ? 'primary.dark' : 'rgba(255,107,53,0.1)',
                    borderColor: 'primary.main'
                  },
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Featured Posts */}
        {selectedCategory === 'All' && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ 
              color: 'white', 
              mb: 4, 
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500
            }}>
              Featured Articles
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4 
            }}>
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '450px',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(255,107,53,0.2)',
                        border: '1px solid rgba(255,107,53,0.4)'
                      }
                    }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip 
                          label={post.category} 
                          size="small"
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                          <AccessTime sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            {post.readTime} min
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="h5" sx={{ 
                        color: 'white', 
                        mb: 2, 
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        lineHeight: 1.3
                      }}>
                        {post.title}
                      </Typography>
                      
                      <Typography sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 3,
                        fontFamily: '"Inter", sans-serif',
                        lineHeight: 1.5
                      }}>
                        {post.excerpt}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <Typography sx={{ fontSize: '1rem' }}>
                              {post.author.avatar}
                            </Typography>
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>
                              {post.author.name}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                              {post.publishDate.toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Visibility sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            {post.views.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        )}

        {/* All Posts Grid */}
        <Typography variant="h3" sx={{ 
          color: 'white', 
          mb: 4, 
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 500
        }}>
          {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '450px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,107,53,0.3)'
                  }
                }}
                onClick={() => setSelectedPost(post)}
              >
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip 
                      label={post.category} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,107,53,0.2)',
                        color: 'white',
                        border: '1px solid rgba(255,107,53,0.3)',
                        fontWeight: 500
                      }}
                    />
                    {post.featured && (
                      <Chip 
                        label="Featured" 
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,215,0,0.2)',
                          color: '#FFD700',
                          border: '1px solid rgba(255,215,0,0.3)',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    mb: 1.5, 
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    minHeight: '2.6em'
                  }}>
                    {post.title}
                  </Typography>
                  
                  <Typography sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 2,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        {post.readTime} min read
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        {post.views}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{
            mt: 8,
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,107,53,0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              mb: 2,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600
            }}>
              Ready to Experience LemoTech?
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 3,
              fontFamily: '"Inter", sans-serif'
            }}>
              Join thousands of satisfied customers who've discovered the convenience of professional cleaning services.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 4,
                py: 1.5,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255,107,53,0.3)'
                }
              }}
            >
              Book Your Service Now
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
