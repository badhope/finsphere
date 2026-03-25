# GraphQL Development

## Description
Expert in GraphQL development including schema design, resolvers, Apollo Server/Client, subscriptions, and best practices for scalable GraphQL APIs.

## Usage Scenario
Use this skill when:
- Designing GraphQL schemas
- Writing resolvers
- Setting up Apollo Server
- Implementing subscriptions
- Optimizing queries
- GraphQL client integration

## Instructions

### Schema Design

1. **Type Definitions**
   ```graphql
   type User {
     id: ID!
     email: String!
     name: String!
     avatar: String
     posts: [Post!]!
     createdAt: DateTime!
     updatedAt: DateTime!
   }
   
   type Post {
     id: ID!
     title: String!
     content: String!
     author: User!
     comments: [Comment!]!
     tags: [String!]!
     published: Boolean!
     createdAt: DateTime!
   }
   
   type Comment {
     id: ID!
     content: String!
     author: User!
     post: Post!
     createdAt: DateTime!
   }
   
   type Query {
     me: User
     user(id: ID!): User
     users(limit: Int = 10, offset: Int = 0): [User!]!
     post(id: ID!): Post
     posts(filter: PostFilter, limit: Int = 10): [Post!]!
     search(query: String!): SearchResult!
   }
   
   type Mutation {
     createUser(input: CreateUserInput!): User!
     updateUser(id: ID!, input: UpdateUserInput!): User!
     deleteUser(id: ID!): Boolean!
     
     createPost(input: CreatePostInput!): Post!
     updatePost(id: ID!, input: UpdatePostInput!): Post!
     deletePost(id: ID!): Boolean!
     
     createComment(input: CreateCommentInput!): Comment!
   }
   
   type Subscription {
     onPostCreated: Post!
     onCommentAdded(postId: ID!): Comment!
   }
   
   input CreateUserInput {
     email: String!
     name: String!
     password: String!
   }
   
   input UpdateUserInput {
     name: String
     avatar: String
   }
   
   input CreatePostInput {
     title: String!
     content: String!
     tags: [String!]!
   }
   
   input PostFilter {
     authorId: ID
     published: Boolean
     tags: [String!]
   }
   
   union SearchResult = User | Post | Comment
   
   scalar DateTime
   ```

2. **Enums and Interfaces**
   ```graphql
   enum Role {
     ADMIN
     EDITOR
     VIEWER
   }
   
   enum PostStatus {
     DRAFT
     PUBLISHED
     ARCHIVED
   }
   
   interface Node {
     id: ID!
   }
   
   interface Timestamped {
     createdAt: DateTime!
     updatedAt: DateTime!
   }
   
   type User implements Node & Timestamped {
     id: ID!
     email: String!
     name: String!
     role: Role!
     createdAt: DateTime!
     updatedAt: DateTime!
   }
   ```

### Apollo Server

1. **Server Setup**
   ```typescript
   import { ApolloServer } from '@apollo/server';
   import { startStandaloneServer } from '@apollo/server/standalone';
   import { makeExecutableSchema } from '@graphql-tools/schema';
   
   const typeDefs = `#graphql
     type Query {
       hello: String
     }
   `;
   
   const resolvers = {
     Query: {
       hello: () => 'Hello, World!',
     },
   };
   
   const server = new ApolloServer({
     typeDefs,
     resolvers,
   });
   
   const { url } = await startStandaloneServer(server, {
     listen: { port: 4000 },
   });
   
   console.log(`Server ready at ${url}`);
   ```

2. **Resolvers**
   ```typescript
   import { Resolvers } from './generated/graphql';
   
   const resolvers: Resolvers = {
     Query: {
       me: async (_, __, { dataSources, userId }) => {
         if (!userId) throw new AuthenticationError('Not authenticated');
         return dataSources.userAPI.getUser(userId);
       },
       
       user: async (_, { id }, { dataSources }) => {
         const user = await dataSources.userAPI.getUser(id);
         if (!user) throw new UserInputError('User not found');
         return user;
       },
       
       users: async (_, { limit, offset }, { dataSources }) => {
         return dataSources.userAPI.getUsers(limit, offset);
       },
       
       posts: async (_, { filter, limit }, { dataSources }) => {
         return dataSources.postAPI.getPosts(filter, limit);
       },
     },
     
     Mutation: {
       createPost: async (_, { input }, { dataSources, userId }) => {
         if (!userId) throw new AuthenticationError('Not authenticated');
         return dataSources.postAPI.createPost(userId, input);
       },
       
       updatePost: async (_, { id, input }, { dataSources, userId }) => {
         const post = await dataSources.postAPI.getPost(id);
         if (post.authorId !== userId) {
           throw new ForbiddenError('Not authorized');
         }
         return dataSources.postAPI.updatePost(id, input);
       },
     },
     
     User: {
       posts: async (user, _, { dataSources }) => {
         return dataSources.postAPI.getPostsByAuthor(user.id);
       },
     },
     
     Post: {
       author: async (post, _, { dataSources }) => {
         return dataSources.userAPI.getUser(post.authorId);
       },
       comments: async (post, _, { dataSources }) => {
         return dataSources.commentAPI.getCommentsByPost(post.id);
       },
     },
   };
   ```

3. **Data Sources**
   ```typescript
   import { RESTDataSource } from '@apollo/datasource-rest';
   
   export class UserAPI extends RESTDataSource {
     constructor() {
       super();
       this.baseURL = 'https://api.example.com/users/';
     }
     
     async getUser(id: string) {
       return this.get(`${id}`);
     }
     
     async getUsers(limit: number, offset: number) {
       return this.get('', { limit, offset });
     }
     
     async createUser(input: CreateUserInput) {
       return this.post('', input);
     }
   }
   
   export class PostAPI extends RESTDataSource {
     constructor() {
       super();
       this.baseURL = 'https://api.example.com/posts/';
     }
     
     async getPosts(filter: PostFilter, limit: number) {
       return this.get('', { ...filter, limit });
     }
     
     async getPost(id: string) {
       return this.get(`${id}`);
     }
     
     async createPost(authorId: string, input: CreatePostInput) {
       return this.post('', { ...input, authorId });
     }
   }
   ```

4. **Context and Authentication**
   ```typescript
   import { ApolloServer } from '@apollo/server';
   import { verifyToken } from './auth';
   
   interface Context {
     userId?: string;
     dataSources: {
       userAPI: UserAPI;
       postAPI: PostAPI;
     };
   }
   
   const server = new ApolloServer<Context>({
     typeDefs,
     resolvers,
   });
   
   const { url } = await startStandaloneServer(server, {
     context: async ({ req }) => {
       const token = req.headers.authorization?.replace('Bearer ', '');
       let userId;
       
       if (token) {
         try {
           userId = verifyToken(token);
         } catch (e) {
           console.error('Invalid token');
         }
       }
       
       return {
         userId,
         dataSources: {
           userAPI: new UserAPI(),
           postAPI: new PostAPI(),
         },
       };
     },
   });
   ```

### Subscriptions

1. **Server-side Subscriptions**
   ```typescript
   import { PubSub } from 'graphql-subscriptions';
   
   const pubsub = new PubSub();
   
   const POST_CREATED = 'POST_CREATED';
   const COMMENT_ADDED = 'COMMENT_ADDED';
   
   const resolvers = {
     Subscription: {
       onPostCreated: {
         subscribe: () => pubsub.asyncIterator([POST_CREATED]),
       },
       
       onCommentAdded: {
         subscribe: (_, { postId }) => {
           return pubsub.asyncIterator([`${COMMENT_ADDED}_${postId}`]);
         },
       },
     },
     
     Mutation: {
       createPost: async (_, { input }, { dataSources, userId }) => {
         const post = await dataSources.postAPI.createPost(userId, input);
         pubsub.publish(POST_CREATED, { onPostCreated: post });
         return post;
       },
       
       createComment: async (_, { input }, { dataSources, userId }) => {
         const comment = await dataSources.commentAPI.createComment(userId, input);
         pubsub.publish(`${COMMENT_ADDED}_${input.postId}`, { 
           onCommentAdded: comment 
         });
         return comment;
       },
     },
   };
   ```

2. **WebSocket Setup**
   ```typescript
   import { createServer } from 'http';
   import { WebSocketServer } from 'ws';
   import { useServer } from 'graphql-ws/lib/use/ws';
   import { makeExecutableSchema } from '@graphql-tools/schema';
   
   const schema = makeExecutableSchema({ typeDefs, resolvers });
   
   const httpServer = createServer();
   
   const wsServer = new WebSocketServer({
     server: httpServer,
     path: '/graphql',
   });
   
   useServer({ schema }, wsServer);
   ```

### Apollo Client

1. **Client Setup**
   ```typescript
   import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
   import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
   import { createClient } from 'graphql-ws';
   import { getMainDefinition } from '@apollo/client/utilities';
   
   const httpLink = new HttpLink({
     uri: 'http://localhost:4000/graphql',
   });
   
   const wsLink = new GraphQLWsLink(
     createClient({
       url: 'ws://localhost:4000/graphql',
     })
   );
   
   const splitLink = split(
     ({ query }) => {
       const definition = getMainDefinition(query);
       return (
         definition.kind === 'OperationDefinition' &&
         definition.operation === 'subscription'
       );
     },
     wsLink,
     httpLink
   );
   
   export const client = new ApolloClient({
     link: splitLink,
     cache: new InMemoryCache(),
   });
   ```

2. **Queries**
   ```typescript
   import { gql, useQuery, useLazyQuery } from '@apollo/client';
   
   const GET_USER = gql`
     query GetUser($id: ID!) {
       user(id: $id) {
         id
         name
         email
         posts {
           id
           title
         }
       }
     }
   `;
   
   function UserProfile({ userId }: { userId: string }) {
     const { loading, error, data, refetch } = useQuery(GET_USER, {
       variables: { id: userId },
       fetchPolicy: 'cache-and-network',
     });
     
     if (loading) return <p>Loading...</p>;
     if (error) return <p>Error: {error.message}</p>;
     
     return (
       <div>
         <h1>{data.user.name}</h1>
         <button onClick={() => refetch()}>Refresh</button>
       </div>
     );
   }
   ```

3. **Mutations**
   ```typescript
   import { gql, useMutation } from '@apollo/client';
   
   const CREATE_POST = gql`
     mutation CreatePost($input: CreatePostInput!) {
       createPost(input: $input) {
         id
         title
         content
       }
     }
   `;
   
   function CreatePostForm() {
     const [createPost, { loading, error }] = useMutation(CREATE_POST, {
       onCompleted: (data) => {
         console.log('Post created:', data.createPost);
       },
       update: (cache, { data }) => {
         cache.modify({
           fields: {
             posts: (existingPosts = []) => {
               const newPostRef = cache.writeFragment({
                 data: data.createPost,
                 fragment: gql`
                   fragment NewPost on Post {
                     id
                     title
                     content
                   }
                 `,
               });
               return [...existingPosts, newPostRef];
             },
           },
         });
       },
     });
     
     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       createPost({
         variables: {
           input: { title: 'New Post', content: 'Content', tags: [] },
         },
       });
     };
     
     return (
       <form onSubmit={handleSubmit}>
         <button type="submit" disabled={loading}>
           {loading ? 'Creating...' : 'Create Post'}
         </button>
         {error && <p>Error: {error.message}</p>}
       </form>
     );
   }
   ```

4. **Subscriptions**
   ```typescript
   import { gql, useSubscription } from '@apollo/client';
   
   const ON_POST_CREATED = gql`
     subscription OnPostCreated {
       onPostCreated {
         id
         title
         author {
           name
         }
       }
     }
   `;
   
   function PostList() {
     const { data, loading } = useSubscription(ON_POST_CREATED);
     
     if (loading) return <p>Waiting for posts...</p>;
     
     return (
       <div>
         <h3>New Post: {data.onPostCreated.title}</h3>
         <p>By: {data.onPostCreated.author.name}</p>
       </div>
     );
   }
   ```

### Performance

1. **DataLoader for N+1 Problem**
   ```typescript
   import DataLoader from 'dataloader';
   
   const userLoader = new DataLoader(async (ids: string[]) => {
     const users = await getUsersByIds(ids);
     return ids.map((id) => users.find((user) => user.id === id));
   });
   
   const resolvers = {
     Post: {
       author: async (post, _, { userLoader }) => {
         return userLoader.load(post.authorId);
       },
     },
   };
   ```

2. **Query Complexity**
   ```typescript
   import { createComplexityLimitRule } from 'graphql-validation-complexity';
   
   const server = new ApolloServer({
     typeDefs,
     resolvers,
     validationRules: [
       createComplexityLimitRule(1000, {
         onCost: (cost) => console.log('Query cost:', cost),
       }),
     ],
   });
   ```

## Output Contract
- GraphQL schemas
- Resolvers
- Apollo Server setup
- Apollo Client queries
- Subscription implementations

## Constraints
- Use proper error handling
- Implement authentication
- Handle N+1 queries
- Validate inputs
- Document schema

## Examples

### Example 1: Complete Schema
```graphql
type Query {
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

input CreateUserInput {
  name: String!
  email: String!
}
```

### Example 2: Resolver with DataLoader
```typescript
const resolvers = {
  Query: {
    posts: async (_, __, { dataSources }) => {
      return dataSources.postAPI.getPosts();
    },
  },
  Post: {
    author: async (post, _, { loaders }) => {
      return loaders.user.load(post.authorId);
    },
  },
};
```
