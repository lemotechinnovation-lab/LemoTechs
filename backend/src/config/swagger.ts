// Swagger/OpenAPI 3.0 specification
export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'LemoTech API Documentation',
    version: '1.0.0',
    description: 'Complete API documentation for LemoTech on-demand cleaning service platform',
    contact: {
      name: 'LemoTech API Support',
      email: 'support@lemotech.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server'
    },
    {
      url: 'https://lemotech-api-backend.azurewebsites.net',
      description: 'Production server (App Service)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['customer', 'driver', 'shop_owner', 'admin'] }
        }
      },
      Booking: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'confirmed', 'pickup', 'cleaning', 'delivery', 'completed', 'cancelled'] },
          amount: { type: 'number' },
          items: { type: 'array', items: { type: 'string' } }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Check if the API server is running',
        responses: {
          '200': {
            description: 'Server is running',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new user',
        description: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  phone: { type: 'string' }
                },
                required: ['name', 'email', 'password']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user and return JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/api/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List user bookings',
        description: 'Get all bookings for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of bookings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Booking' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create new booking',
        description: 'Create a new cleaning service booking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: { type: 'array', items: { type: 'string' } },
                  pickupLocation: { type: 'object' },
                  deliveryLocation: { type: 'object' },
                  specialInstructions: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Booking created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },

    // Additional Authentication Routes
    '/api/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Token refreshed successfully' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logout successful' }
        }
      }
    },

    // Admin Routes
    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all users (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'role', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Users retrieved successfully' }
        }
      }
    },
    '/api/admin/bookings': {
      get: {
        tags: ['Admin'],
        summary: 'Get all bookings (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'All bookings retrieved successfully' }
        }
      }
    },
    '/api/admin/analytics': {
      get: {
        tags: ['Admin'],
        summary: 'Get system analytics (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Analytics retrieved successfully' }
        }
      }
    },

    // Driver Routes
    '/api/drivers/available': {
      get: {
        tags: ['Drivers'],
        summary: 'Get available drivers',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Available drivers retrieved successfully' }
        }
      }
    },
    '/api/drivers/location': {
      post: {
        tags: ['Drivers'],
        summary: 'Update driver location',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['latitude', 'longitude'],
                properties: {
                  latitude: { type: 'number', example: -26.2041 },
                  longitude: { type: 'number', example: 28.0473 }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Location updated successfully' }
        }
      }
    },
    '/api/drivers/jobs': {
      get: {
        tags: ['Drivers'],
        summary: 'Get driver jobs',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Driver jobs retrieved successfully' }
        }
      }
    },
    '/api/drivers/earnings': {
      get: {
        tags: ['Drivers'],
        summary: 'Get driver earnings',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Earnings retrieved successfully' }
        }
      }
    },

    // Shop Routes
    '/api/shops': {
      get: {
        tags: ['Shops'],
        summary: 'Get all shops',
        responses: {
          '200': { description: 'Shops retrieved successfully' }
        }
      },
      post: {
        tags: ['Shops'],
        summary: 'Create a new shop',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'address'],
                properties: {
                  name: { type: 'string', example: 'LemoTech Cleaning Hub' },
                  address: { type: 'string', example: '123 Business St, City' },
                  coordinates: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Shop created successfully' }
        }
      }
    },

    // Payment Routes (PayFast)
    '/api/payments/create-payment': {
      post: {
        tags: ['Payments'],
        summary: 'Create payment request',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: {
                  amount: { type: 'number', example: 150.00 },
                  itemName: { type: 'string', example: 'Shoe Cleaning Service' },
                  customerEmail: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Payment request created successfully' }
        }
      }
    },
    '/api/payments/webhook': {
      post: {
        tags: ['Payments'],
        summary: 'PayFast webhook notification',
        responses: {
          '200': { description: 'Webhook processed successfully' }
        }
      }
    },

    // File Upload Routes
    '/api/upload': {
      post: {
        tags: ['File Management'],
        summary: 'Upload single file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'File uploaded successfully' }
        }
      }
    },
    '/api/upload/multiple': {
      post: {
        tags: ['File Management'],
        summary: 'Upload multiple files',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Files uploaded successfully' }
        }
      }
    },

    // Cleaning Workflow Routes
    '/api/cleaning/items/from-booking': {
      post: {
        tags: ['Cleaning Workflow'],
        summary: 'Create cleaning items from booking',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Cleaning items created successfully' }
        }
      }
    },

    // Shop Management Routes
    '/api/shop-management/orders/queue': {
      get: {
        tags: ['Shop Management'],
        summary: 'Get live order queue',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Order queue retrieved successfully' }
        }
      }
    },
    '/api/shop-management/staff/dashboard': {
      get: {
        tags: ['Shop Management'],
        summary: 'Get staff dashboard',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Staff dashboard retrieved successfully' }
        }
      }
    },

    // Route Optimization Routes
    '/api/route-optimization/optimize': {
      post: {
        tags: ['Route Optimization'],
        summary: 'Optimize delivery route',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  stops: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                        address: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Route optimized successfully' }
        }
      }
    }
  }
};
