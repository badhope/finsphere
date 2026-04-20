# API Requests Skill

## Description
This Skill enables the AI to perform HTTP API requests, interact with RESTful and GraphQL APIs, handle authentication, process responses, and integrate API data into applications and workflows.

## Core Capabilities

### 1. API Interaction
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, etc.
- **RESTful API**: Interact with REST-based services
- **GraphQL API**: Query and mutate data using GraphQL
- **WebSockets**: Handle real-time API connections

### 2. Authentication and Security
- **API Key Authentication**: Manage API keys and tokens
- **OAuth Integration**: Handle OAuth2.0 authentication flows
- **JWT Token Management**: Create and validate JWT tokens
- **HTTPS Security**: Ensure secure API communications

### 3. Request Configuration
- **Headers Management**: Set and manage HTTP headers
- **Query Parameters**: Configure URL query parameters
- **Request Body**: Format and send request bodies (JSON, form data, etc.)
- **Timeouts and Retries**: Configure request timeouts and retry strategies

### 4. Response Processing
- **Response Parsing**: Parse JSON, XML, and other response formats
- **Error Handling**: Handle API errors and exceptions
- **Rate Limit Management**: Respect API rate limits
- **Data Transformation**: Convert API responses to usable formats

### 5. API Integration
- **API Client Creation**: Generate API client code
- **SDK Integration**: Work with API SDKs
- **Webhook Setup**: Configure and handle webhooks
- **API Testing**: Test API endpoints and responses

## Technical Implementation

### MCP Tool Integration
- **Recommended MCP Tools** (AI should search for these):
  - `http` - For making HTTP requests
  - `api` - For API-specific operations
  - `json` - For JSON parsing and manipulation
  - `thinking` - For complex API logic and error handling
  - `filesystem` - For storing API configurations and responses

### API Technologies
- **REST APIs**: Representational State Transfer
- **GraphQL**: Query language for APIs
- **SOAP**: Simple Object Access Protocol
- **gRPC**: High-performance RPC framework
- **WebSockets**: Real-time bidirectional communication

### Data Formats
- **JSON**: JavaScript Object Notation
- **XML**: Extensible Markup Language
- **Form Data**: URL-encoded form data
- **Multipart Form Data**: File uploads and binary data
- **Protocol Buffers**: Efficient binary format

## When to Use This Skill

### Trigger Keywords
- **English**: API, HTTP, request, REST, GraphQL, endpoint, authentication, token, webhook, integration
- **Chinese**: API, HTTP, 请求, REST, GraphQL, 端点, 认证, 令牌, 网络钩子, 集成

### Trigger Patterns
- "Can you make an API request to..."
- "I need to integrate with the... API"
- "How do I authenticate with this API?"
- "Can you test this API endpoint?"
- "I need to parse this API response"
- "How do I handle API rate limits?"
- "Can you create an API client for..."
- "I need to set up a webhook for..."
- "How do I handle API errors?"
- "Can you help me with OAuth authentication?"

## Expected Input/Output

### Input
- API endpoint URL
- HTTP method (GET, POST, etc.)
- Request parameters and body
- Authentication details
- Headers and other configuration

### Output
- API response data
- Status code and headers
- Error handling results
- Parsed and transformed data
- API integration code

## Best Practices

### For API Requests
1. **Request Configuration**:
   - Use appropriate HTTP methods
   - Set proper content-type headers
   - Include necessary authentication
   - Validate request parameters

2. **Error Handling**:
   - Handle HTTP error status codes
   - Implement retry strategies for transient errors
   - Log errors for debugging
   - Provide meaningful error messages

3. **Performance Optimization**:
   - Use connection pooling
   - Implement caching where appropriate
   - Batch requests when possible
   - Optimize payload size

### For API Integration
1. **Authentication Management**:
   - Securely store API keys and tokens
   - Implement token refresh mechanisms
   - Use environment variables for credentials
   - Rotate API keys regularly

2. **Rate Limit Handling**:
   - Monitor API rate limits
   - Implement backoff strategies
   - Cache responses to reduce requests
   - Schedule requests during off-peak times

3. **Data Processing**:
   - Validate and sanitize API responses
   - Handle pagination for large datasets
   - Transform data to match application needs
   - Monitor data consistency

## Constraints
- **Security**: Never expose API keys or credentials in code
- **Rate Limits**: Respect API rate limits and usage policies
- **Error Handling**: Implement comprehensive error handling
- **Data Privacy**: Handle user data according to privacy regulations
- **Reliability**: Implement retry mechanisms for transient failures

## Example Usage

### Example 1: REST API Request
**Input**:
```
User: Can you make a GET request to the GitHub API to get information about the Trae-Skill repository?
```

**Output**:
```
# API Request: GitHub Repository Information

## Request Details
- **Method**: GET
- **Endpoint**: https://api.github.com/repos/Trae-Skill/Trae-Skill
- **Headers**:
  - Accept: application/vnd.github.v3+json

## Response
- **Status Code**: 200 OK
- **Response Time**: 320ms

## Parsed Data
{
  "name": "Trae-Skill",
  "full_name": "Trae-Skill/Trae-Skill",
  "description": "Trae IDE skills and MCP tools",
  "stargazers_count": 145,
  "forks_count": 23,
  "open_issues_count": 7,
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-04-18T15:45:00Z",
  "language": "TypeScript",
  "topics": ["ai", "ide", "skills", "mcp", "agents"]
}

## Key Information
- Repository has 145 stars and 23 forks
- Primary language is TypeScript
- Last updated on April 18, 2026
- 7 open issues
- Topics include AI, IDE, skills, MCP, and agents
```

### Example 2: GraphQL API Request
**Input**:
```
User: Can you make a GraphQL request to the GitHub API to get the latest 5 commits for the Trae-Skill repository?
```

**Output**:
```
# API Request: GitHub Commits

## Request Details
- **Method**: POST
- **Endpoint**: https://api.github.com/graphql
- **Headers**:
  - Content-Type: application/json
  - Authorization: Bearer [API_TOKEN]

## GraphQL Query
```graphql
query {
  repository(owner: "Trae-Skill", name: "Trae-Skill") {
    defaultBranchRef {
      name
      target {
        ... on Commit {
          history(first: 5) {
            nodes {
              oid
              messageHeadline
              author {
                name
                email
                date
              }
            }
          }
        }
      }
    }
  }
}
```

## Response
- **Status Code**: 200 OK
- **Response Time**: 450ms

## Parsed Data
{
  "repository": {
    "defaultBranchRef": {
      "name": "main",
      "target": {
        "history": {
          "nodes": [
            {
              "oid": "abc123",
              "messageHeadline": "Add Context Optimization Skill",
              "author": {
                "name": "Developer",
                "email": "dev@example.com",
                "date": "2026-04-19T09:15:00Z"
              }
            },
            {
              "oid": "def456",
              "messageHeadline": "Update Orchestrator Skill",
              "author": {
                "name": "Developer",
                "email": "dev@example.com",
                "date": "2026-04-18T14:30:00Z"
              }
            },
            {
              "oid": "ghi789",
              "messageHeadline": "Fix security audit issues",
              "author": {
                "name": "Developer",
                "email": "dev@example.com",
                "date": "2026-04-17T11:45:00Z"
              }
            },
            {
              "oid": "jkl012",
              "messageHeadline": "Add performance optimization tools",
              "author": {
                "name": "Developer",
                "email": "dev@example.com",
                "date": "2026-04-16T16:20:00Z"
              }
            },
            {
              "oid": "mno345",
              "messageHeadline": "Update documentation",
              "author": {
                "name": "Developer",
                "email": "dev@example.com",
                "date": "2026-04-15T10:05:00Z"
              }
            }
          ]
        }
      }
    }
  }
}
```

## Key Information
- Latest commit: "Add Context Optimization Skill" (April 19, 2026)
- 5 recent commits spanning April 15-19, 2026
- All commits by the same author
- Commits include feature additions and bug fixes
```

### Example 3: API Authentication
**Input**:
```
User: How do I authenticate with the Twitter API using OAuth 2.0?
```

**Output**:
```
# API Authentication: Twitter OAuth 2.0

## Authentication Flow
1. **Application Registration**
   - Create a Twitter Developer account
   - Create a new application in the Twitter Developer Portal
   - Obtain API Key, API Key Secret, Client ID, and Client Secret

2. **OAuth 2.0 Authorization Code Flow**
   - Redirect user to Twitter's authorization URL
   - User authenticates and authorizes your application
   - Twitter redirects back with an authorization code
   - Exchange authorization code for access token

3. **Token Management**
   - Store access token securely
   - Use token in API requests
   - Refresh token when it expires

## Example Code
```javascript
// Step 1: Generate authorization URL
const authUrl = `https://twitter.com/i/oauth2/authorize?
  response_type=code&
  client_id=${encodeURIComponent(CLIENT_ID)}&
  redirect_uri=${encodeURIComponent(REDIRECT_URI)}&
  scope=tweet.read%20users.read&
  state=${encodeURIComponent(STATE)}`;

// Step 2: Exchange code for token
async function getAccessToken(code) {
  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'code': code,
      'grant_type': 'authorization_code',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'redirect_uri': REDIRECT_URI
    })
  });
  
  return response.json();
}

// Step 3: Use token in API requests
async function getTweets() {
  const response = await fetch('https://api.twitter.com/2/tweets/search/recent', {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  });
  
  return response.json();
}
```

## Security Best Practices
- Never expose client secrets in client-side code
- Use environment variables for sensitive credentials
- Implement token rotation and refresh
- Set appropriate token scopes
- Monitor API usage and revoke tokens if compromised
```

## Conclusion
This API Requests Skill enables the AI to effectively interact with a wide range of APIs, from simple REST endpoints to complex GraphQL services. By handling authentication, request configuration, response processing, and error handling, the AI can seamlessly integrate API data into applications and workflows, providing users with powerful capabilities for data retrieval, service integration, and automated interactions with external systems.
