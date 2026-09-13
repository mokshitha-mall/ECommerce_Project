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
          username: {
            type: "string",
            example: "Mokshitha"
          },
          email: {
            type: "string",
            example: "mokshitha@gmail.com"
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
            example: "user"
          }
        }
      },

      SignupRequest: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: {
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
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
            example: "user"
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

      UpdateUserRequest: {
        type: "object",
        properties: {
          username: {
            type: "string",
            example: "MokshithaUpdated"
          },
          email: {
            type: "string",
            example: "mokshitha_new@gmail.com"
          },
          password: {
            type: "string",
            example: "newpassword123"
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
            example: "admin"
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
          quantity: {
            type: "integer",
            example: 10
          },
          published: {
            type: "boolean",
            example: true
          }
        }
      },

      CreateProductRequest: {
        type: "object",
        required: ["name", "description", "price", "category", "quantity"],
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
          },
          quantity: {
            type: "integer",
            example: 10
          },
          published: {
            type: "boolean",
            example: false
          }
        }
      }
    }
  },

  paths: {
    // =========================
    // AUTH
    // =========================
    "/auth/signup": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SignupRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "User Signup Successful"
          },
          400: {
            description: "Fields are required or Email Already Registered"
          },
          500: {
            description: "Unable to create the user"
          }
        }
      }
    },

    "/auth/login": {
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
            description: "Login Successful"
          },
          400: {
            description: "All Fields are required"
          },
          404: {
            description: "Invalid email or password"
          }
        }
      }
    },

    // =========================
    // PRODUCTS
    // =========================
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            example: "Electronics"
          },
          {
            name: "minPrice",
            in: "query",
            schema: { type: "number" },
            example: 1000
          },
          {
            name: "maxPrice",
            in: "query",
            schema: { type: "number" },
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
            schema: { type: "integer" },
            example: 1
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            example: 10
          }
        ],
        responses: {
          200: {
            description: "Products retrieved successfully"
          },
          500: {
            description: "Unable to get the products"
          }
        }
      },

      post: {
        tags: ["Products"],
        summary: "Create a product (Admin only)",
        security: [{ bearerAuth: [] }],
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
          400: {
            description: "All fields are required to create a product"
          },
          500: {
            description: "Unable to create the product"
          }
        }
      }
    },

    "/products/import": {
      post: {
        tags: ["Products"],
        summary: "Import products via CSV (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "CSV file with products"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Products imported successfully"
          },
          400: {
            description: "CSV File is empty or Validation Failed"
          },
          500: {
            description: "Unable to import products"
          }
        }
      }
    },

    "/products/export": {
      get: {
        tags: ["Products"],
        summary: "Export products to CSV (Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "CSV file download",
            content: {
              "text/csv": {
                schema: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          },
          500: {
            description: "Unable to export products"
          }
        }
      }
    },

    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Product retrieved successfully"
          },
          400: {
            description: "Product Id is invalid or unauthorized role"
          },
          404: {
            description: "Product not found"
          }
        }
      },

      put: {
        tags: ["Products"],
        summary: "Update product (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
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
          400: {
            description: "Product Id is invalid"
          },
          404: {
            description: "Product not found"
          }
        }
      },

      delete: {
        tags: ["Products"],
        summary: "Delete product (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Product deleted successfully"
          },
          400: {
            description: "Product Id is invalid"
          },
          404: {
            description: "Product not found"
          }
        }
      }
    },

    "/products/{id}/publish": {
      patch: {
        tags: ["Products"],
        summary: "Publish product (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Product is successfully published"
          },
          400: {
            description: "Product Id is invalid"
          },
          404: {
            description: "Product not found"
          }
        }
      }
    },

    "/products/{id}/unpublish": {
      patch: {
        tags: ["Products"],
        summary: "Unpublish product (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Product is unPublished"
          },
          400: {
            description: "Product Id is invalid"
          },
          404: {
            description: "Product not found"
          }
        }
      }
    },

    // =========================
    // USERS
    // =========================
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Users retrieved successfully"
          },
          404: {
            description: "No users Found"
          }
        }
      }
    },

    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "User retrieved successfully"
          },
          400: {
            description: "Invalid user id"
          },
          404: {
            description: "User not found"
          }
        }
      },

      put: {
        tags: ["Users"],
        summary: "Update user (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateUserRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "User updated successfully"
          },
          400: {
            description: "Invalid user id"
          },
          404: {
            description: "User not found"
          }
        }
      },

      delete: {
        tags: ["Users"],
        summary: "Delete user (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "User deleted successfully"
          },
          400: {
            description: "Invalid user id"
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