# API Design

## Description
Expert in RESTful and GraphQL API design, including endpoint design, authentication, versioning, documentation, and best practices for scalable APIs.

## Usage Scenario
Use this skill when:
- Designing new API endpoints
- Implementing RESTful conventions
- GraphQL schema design
- API versioning strategies
- Authentication and authorization
- API documentation generation

## Instructions

### RESTful API Design

1. **Resource Naming**
   - Use nouns, not verbs: `/users` not `/getUsers`
   - Use plural for collections: `/users`, `/orders`
   - Use kebab-case: `/user-profiles`
   - Nest for relationships: `/users/{id}/orders`

2. **HTTP Methods**
   ```
   GET    /users           # List users
   GET    /users/{id}      # Get single user
   POST   /users           # Create user
   PUT    /users/{id}      # Replace user
   PATCH  /users/{id}      # Partial update
   DELETE /users/{id}      # Delete user
   ```

3. **Status Codes**
   ```
   200 OK              # Successful GET, PUT, PATCH
   201 Created         # Successful POST
   204 No Content      # Successful DELETE
   400 Bad Request     # Invalid input
   401 Unauthorized    # Authentication required
   403 Forbidden       # Permission denied
   404 Not Found       # Resource not found
   409 Conflict        # Duplicate resource
   422 Unprocessable   # Validation error
   429 Too Many Requests # Rate limited
   500 Internal Error  # Server error
   ```

4. **Request/Response Format**
   ```json
   // GET /users/123
   {
     "id": 123,
     "name": "John Doe",
     "email": "john@example.com",
     "created_at": "2024-03-25T10:00:00Z",
     "updated_at": "2024-03-25T10:00:00Z"
   }
   
   // Error Response
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid email format",
       "details": [
         {"field": "email", "message": "Must be a valid email"}
       ]
     }
   }
   ```

### Pagination, Filtering, Sorting

1. **Pagination**
   ```
   GET /users?page=1&limit=20
   
   Response:
   {
     "data": [...],
     "pagination": {
       "page": 1,
       "limit": 20,
       "total": 100,
       "total_pages": 5
     }
   }
   
   # Cursor-based (for large datasets)
   GET /users?cursor=abc123&limit=20
   ```

2. **Filtering**
   ```
   GET /users?status=active&role=admin
   GET /users?created_at_gte=2024-01-01
   GET /users?name_like=john
   ```

3. **Sorting**
   ```
   GET /users?sort=name
   GET /users?sort=-created_at  # Descending
   GET /users?sort=name,-created_at  # Multiple fields
   ```

4. **Field Selection**
   ```
   GET /users?fields=id,name,email
   ```

### Authentication & Authorization

1. **JWT Authentication**
   ```json
   // Login Request
   POST /auth/login
   {
     "email": "user@example.com",
     "password": "secret"
   }
   
   // Response
   {
     "access_token": "eyJhbGciOiJIUzI1NiIs...",
     "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
     "expires_in": 3600
   }
   
   // API Request
   GET /users
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

2. **API Key Authentication**
   ```
   GET /api/v1/users
   X-API-Key: your-api-key
   
   # Or as query param (less secure)
   GET /api/v1/users?api_key=your-api-key
   ```

3. **OAuth 2.0**
   ```
   Authorization Code Flow:
   1. GET /oauth/authorize?client_id=xxx&redirect_uri=xxx&response_type=code
   2. Redirect: /callback?code=auth_code
   3. POST /oauth/token {code, client_id, client_secret}
   4. Response: {access_token, refresh_token}
   ```

### API Versioning

1. **URL Path Versioning**
   ```
   /api/v1/users
   /api/v2/users
   ```

2. **Header Versioning**
   ```
   GET /users
   Accept: application/vnd.myapi.v1+json
   ```

3. **Query Parameter**
   ```
   GET /users?version=1
   ```

### GraphQL Schema Design

1. **Type Definitions**
   ```graphql
   type User {
     id: ID!
     name: String!
     email: String!
     posts: [Post!]!
     createdAt: DateTime!
   }
   
   type Post {
     id: ID!
     title: String!
     content: String
     author: User!
     comments: [Comment!]!
   }
   
   type Query {
     user(id: ID!): User
     users(filter: UserFilter, page: Int, limit: Int): UserConnection!
     search(query: String!): [SearchResult!]!
   }
   
   type Mutation {
     createUser(input: CreateUserInput!): User!
     updateUser(id: ID!, input: UpdateUserInput!): User!
     deleteUser(id: ID!): Boolean!
   }
   
   input CreateUserInput {
     name: String!
     email: String!
     password: String!
   }
   ```

2. **Best Practices**
   - Use non-nullable fields (!) by default
   - Implement pagination for lists
   - Use input types for mutations
   - Add descriptions for documentation

### Rate Limiting

1. **Headers**
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   X-RateLimit-Reset: 1648214400
   
   # When limited
   HTTP 429 Too Many Requests
   Retry-After: 60
   ```

2. **Implementation**
   ```python
   from fastapi import FastAPI, Request
   from slowapi import Limiter
   
   app = FastAPI()
   limiter = Limiter(key_func=get_remote_address)
   
   @app.get("/api/users")
   @limiter.limit("100/minute")
   async def list_users(request: Request):
       return {"users": [...]}
   ```

### Documentation

1. **OpenAPI/Swagger**
   ```yaml
   openapi: 3.0.0
   info:
     title: User API
     version: 1.0.0
   
   paths:
     /users:
       get:
         summary: List all users
         parameters:
           - name: page
             in: query
             schema:
               type: integer
               default: 1
         responses:
           '200':
             description: Successful response
             content:
               application/json:
                 schema:
                   $ref: '#/components/schemas/UserList'
   
   components:
     schemas:
       User:
         type: object
         properties:
           id:
             type: integer
           name:
             type: string
   ```

## Output Contract
- API endpoint specifications
- Request/response schemas
- Authentication configuration
- Documentation templates
- Best practice recommendations

## Constraints
- Follow RESTful conventions
- Version all APIs
- Document all endpoints
- Implement proper error handling
- Include rate limiting for public APIs

## Examples

### Example 1: Complete REST API Design
```yaml
# User Management API

## Endpoints

### Users
GET    /api/v1/users           # List users
GET    /api/v1/users/{id}      # Get user
POST   /api/v1/users           # Create user
PUT    /api/v1/users/{id}      # Update user
DELETE /api/v1/users/{id}      # Delete user

### User Posts
GET    /api/v1/users/{id}/posts  # Get user's posts
POST   /api/v1/users/{id}/posts  # Create post for user

## Query Parameters
?page=1&limit=20
&sort=-created_at
&status=active
&fields=id,name,email

## Response Format
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2",
    "prev": null
  }
}
```

### Example 2: GraphQL Schema
```graphql
type Query {
  "Get a single user by ID"
  user(id: ID!): User
  
  "List users with pagination and filtering"
  users(
    filter: UserFilter
    page: Int = 1
    limit: Int = 20
  ): UserConnection!
}

input UserFilter {
  status: UserStatus
  role: Role
  search: String
  createdAfter: DateTime
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```
