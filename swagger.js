import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "Ecommerce API",
    version: "1.0.0",
    description: "API documentation for the Ecommerce project"
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },

    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "64abc123456789"
          },
          name: {
            type: "string",
            example: "Mokshitha"
          },
          email: {
            type: "string",
            example: "mokshitha@gmail.com"
          },
          role: {
            type: "string",
            example: "user"
          }
        }
      },

      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            example: "Mokshitha"
          },
          email: {
            type: "string",
            example: "mokshitha@gmail.com"
          },
          password: {
            type: "string",
            example: "123456"
          }
        }
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            example: "mokshitha@gmail.com"
          },
          password: {
            type: "string",
            example: "123456"
          }
        }
      },

      Product: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "64abc123456789"
          },
          name: {
            type: "string",
            example: "Laptop"
          },
          description: {
            type: "string",
            example: "HP Laptop"
          },
          price: {
            type: "number",
            example: 55000
          },
          category: {
            type: "string",
            example: "Electronics"
          },
          published: {
            type: "boolean",
            example: true
          }
        }
      },

      CreateProductRequest: {
        type: "object",
        required: ["name", "price", "category"],
        properties: {
          name: {
            type: "string",
            example: "Laptop"
          },
          description: {
            type: "string",
            example: "HP Laptop"
          },
          price: {
            type: "number",
            example: 55000
          },
          category: {
            type: "string",
            example: "Electronics"
          }
        }
      },

      UpdateUserRoleRequest: {
        type: "object",
        required: ["role"],
        properties: {
          role: {
            type: "string",
            example: "admin"
          }
        }
      }
    }
  },

  paths: {
    // =========================
    // AUTH
    // =========================

    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest"
              }
            }
          }
        },

        responses: {
          201: {
            description: "User registered successfully"
          },
          400: {
            description: "Invalid request"
          }
        }
      }
    },

    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest"
              }
            }
          }
        },

        responses: {
          200: {
            description: "Login successful"
          },
          401: {
            description: "Invalid email or password"
          }
        }
      }
    },

    // =========================
    // PRODUCTS
    // =========================

    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "category",
            in: "query",
            schema: {
              type: "string"
            },
            example: "Electronics"
          },
          {
            name: "minPrice",
            in: "query",
            schema: {
              type: "number"
            },
            example: 1000
          },
          {
            name: "maxPrice",
            in: "query",
            schema: {
              type: "number"
            },
            example: 50000
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["price_asc", "price_desc", "newest"]
            },
            example: "price_asc"
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer"
            },
            example: 1
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer"
            },
            example: 10
          }
        ],

        responses: {
          200: {
            description: "Products retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          }
        }
      },

      post: {
        tags: ["Products"],
        summary: "Create a product - Admin only",

        security: [
          {
            bearerAuth: []
          }
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateProductRequest"
              }
            }
          }
        },

        responses: {
          201: {
            description: "Product created successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Admin access required"
          }
        }
      }
    },

    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Product retrieved successfully"
          },
          404: {
            description: "Product not found"
          }
        }
      },

      put: {
        tags: ["Products"],
        summary: "Update product",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateProductRequest"
              }
            }
          }
        },

        responses: {
          200: {
            description: "Product updated successfully"
          },
          404: {
            description: "Product not found"
          }
        }
      },

      delete: {
        tags: ["Products"],
        summary: "Delete product",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Product deleted successfully"
          },
          404: {
            description: "Product not found"
          }
        }
      }
    },

    "/api/products/{id}/publish": {
      patch: {
        tags: ["Products"],
        summary: "Publish product",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Product published successfully"
          }
        }
      }
    },

    "/api/products/{id}/unpublish": {
      patch: {
        tags: ["Products"],
        summary: "Unpublish product",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "Product unpublished successfully"
          }
        }
      }
    },

    // =========================
    // USERS
    // =========================

    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",

        security: [
          {
            bearerAuth: []
          }
        ],

        responses: {
          200: {
            description: "Users retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          }
        }
      }
    },

    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "User retrieved successfully"
          },
          404: {
            description: "User not found"
          }
        }
      },

      delete: {
        tags: ["Users"],
        summary: "Delete user",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        responses: {
          200: {
            description: "User deleted successfully"
          },
          404: {
            description: "User not found"
          }
        }
      }
    },

    "/api/users/{id}/role": {
      patch: {
        tags: ["Users"],
        summary: "Update user role",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateUserRoleRequest"
              }
            }
          }
        },

        responses: {
          200: {
            description: "User role updated successfully"
          },
          404: {
            description: "User not found"
          }
        }
      }
    }
  }
};

export { swaggerUi, swaggerDocument };