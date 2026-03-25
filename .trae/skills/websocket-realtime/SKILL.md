# WebSocket Realtime

## Description
Expert in real-time application development using WebSocket, Socket.io, and server-sent events for live updates, chat applications, and collaborative features.

## Usage Scenario
Use this skill when:
- Building real-time applications
- Implementing chat systems
- Live data updates
- Collaborative editing
- Gaming applications
- Push notifications

## Instructions

### Native WebSocket

1. **Server-side (Node.js)**
   ```typescript
   import { WebSocketServer, WebSocket } from 'ws';
   import http from 'http';
   
   const server = http.createServer();
   const wss = new WebSocketServer({ server });
   
   interface Client {
     ws: WebSocket;
     userId: string;
     rooms: Set<string>;
   }
   
   const clients = new Map<WebSocket, Client>();
   
   wss.on('connection', (ws, req) => {
     const userId = getUserIdFromRequest(req);
     clients.set(ws, { ws, userId, rooms: new Set() });
     
     console.log(`Client connected: ${userId}`);
     
     ws.on('message', (data) => {
       try {
         const message = JSON.parse(data.toString());
         handleMessage(ws, message);
       } catch (error) {
         ws.send(JSON.stringify({ error: 'Invalid message format' }));
       }
     });
     
     ws.on('close', () => {
       clients.delete(ws);
       console.log(`Client disconnected: ${userId}`);
     });
     
     ws.send(JSON.stringify({ type: 'connected', userId }));
   });
   
   function handleMessage(ws: WebSocket, message: any) {
     const client = clients.get(ws);
     if (!client) return;
     
     switch (message.type) {
       case 'join':
         client.rooms.add(message.room);
         broadcastToRoom(message.room, {
           type: 'user_joined',
           userId: client.userId,
         });
         break;
         
       case 'leave':
         client.rooms.delete(message.room);
         broadcastToRoom(message.room, {
           type: 'user_left',
           userId: client.userId,
         });
         break;
         
       case 'message':
         broadcastToRoom(message.room, {
           type: 'message',
           userId: client.userId,
           content: message.content,
           timestamp: Date.now(),
         });
         break;
     }
   }
   
   function broadcastToRoom(room: string, message: any) {
     const messageStr = JSON.stringify(message);
     clients.forEach((client) => {
       if (client.rooms.has(room)) {
         client.ws.send(messageStr);
       }
     });
   }
   
   server.listen(8080, () => {
     console.log('WebSocket server running on port 8080');
   });
   ```

2. **Client-side**
   ```typescript
   class WebSocketClient {
     private ws: WebSocket | null = null;
     private reconnectAttempts = 0;
     private maxReconnectAttempts = 5;
     private reconnectDelay = 1000;
     private messageQueue: any[] = [];
     private handlers = new Map<string, Set<(data: any) => void>>();
     
     constructor(private url: string) {}
     
     connect(): Promise<void> {
       return new Promise((resolve, reject) => {
         this.ws = new WebSocket(this.url);
         
         this.ws.onopen = () => {
           console.log('Connected to WebSocket');
           this.reconnectAttempts = 0;
           this.flushMessageQueue();
           resolve();
         };
         
         this.ws.onmessage = (event) => {
           const message = JSON.parse(event.data);
           this.handleMessage(message);
         };
         
         this.ws.onclose = () => {
           console.log('WebSocket closed');
           this.attemptReconnect();
         };
         
         this.ws.onerror = (error) => {
           console.error('WebSocket error:', error);
           reject(error);
         };
       });
     }
     
     send(message: any) {
       if (this.ws?.readyState === WebSocket.OPEN) {
         this.ws.send(JSON.stringify(message));
       } else {
         this.messageQueue.push(message);
       }
     }
     
     on(type: string, handler: (data: any) => void) {
       if (!this.handlers.has(type)) {
         this.handlers.set(type, new Set());
       }
       this.handlers.get(type)!.add(handler);
     }
     
     off(type: string, handler: (data: any) => void) {
       this.handlers.get(type)?.delete(handler);
     }
     
     private handleMessage(message: any) {
       this.handlers.get(message.type)?.forEach((handler) => handler(message));
       this.handlers.get('*')?.forEach((handler) => handler(message));
     }
     
     private flushMessageQueue() {
       while (this.messageQueue.length > 0) {
         const message = this.messageQueue.shift()!;
         this.send(message);
       }
     }
     
     private attemptReconnect() {
       if (this.reconnectAttempts >= this.maxReconnectAttempts) {
         console.error('Max reconnect attempts reached');
         return;
       }
       
       this.reconnectAttempts++;
       const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
       
       setTimeout(() => {
         console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
         this.connect().catch(console.error);
       }, delay);
     }
     
     close() {
       this.ws?.close();
     }
   }
   
   const client = new WebSocketClient('ws://localhost:8080');
   await client.connect();
   
   client.on('message', (data) => {
     console.log('Received:', data);
   });
   
   client.send({ type: 'join', room: 'general' });
   ```

### Socket.io

1. **Server Setup**
   ```typescript
   import { Server } from 'socket.io';
   import express from 'express';
   import http from 'http';
   
   const app = express();
   const server = http.createServer(app);
   const io = new Server(server, {
     cors: {
       origin: 'http://localhost:3000',
       methods: ['GET', 'POST'],
     },
   });
   
   interface User {
     id: string;
     name: string;
     rooms: string[];
   }
   
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     
     try {
       const user = verifyToken(token);
       socket.data.user = user;
       next();
     } catch (error) {
       next(new Error('Authentication failed'));
     }
   });
   
   io.on('connection', (socket) => {
     const user = socket.data.user as User;
     console.log(`User connected: ${user.name}`);
     
     socket.on('join_room', (roomId: string) => {
       socket.join(roomId);
       socket.to(roomId).emit('user_joined', {
         userId: user.id,
         name: user.name,
       });
       
       io.to(roomId).emit('user_count', io.sockets.adapter.rooms.get(roomId)?.size || 0);
     });
     
     socket.on('leave_room', (roomId: string) => {
       socket.leave(roomId);
       socket.to(roomId).emit('user_left', { userId: user.id });
     });
     
     socket.on('send_message', (data: { roomId: string; content: string }) => {
       io.to(data.roomId).emit('new_message', {
         userId: user.id,
         name: user.name,
         content: data.content,
         timestamp: Date.now(),
       });
     });
     
     socket.on('typing', (roomId: string) => {
       socket.to(roomId).emit('user_typing', { userId: user.id });
     });
     
     socket.on('disconnecting', () => {
       socket.rooms.forEach((room) => {
         socket.to(room).emit('user_left', { userId: user.id });
       });
     });
   });
   
   server.listen(3001, () => {
     console.log('Socket.io server running on port 3001');
   });
   ```

2. **Client Setup**
   ```typescript
   import { io, Socket } from 'socket.io-client';
   
   class ChatClient {
     private socket: Socket;
     
     constructor(url: string, token: string) {
       this.socket = io(url, {
         auth: { token },
         transports: ['websocket'],
       });
       
       this.setupListeners();
     }
     
     private setupListeners() {
       this.socket.on('connect', () => {
         console.log('Connected to server');
       });
       
       this.socket.on('disconnect', () => {
         console.log('Disconnected from server');
       });
       
       this.socket.on('connect_error', (error) => {
         console.error('Connection error:', error);
       });
     }
     
     joinRoom(roomId: string) {
       this.socket.emit('join_room', roomId);
     }
     
     leaveRoom(roomId: string) {
       this.socket.emit('leave_room', roomId);
     }
     
     sendMessage(roomId: string, content: string) {
       this.socket.emit('send_message', { roomId, content });
     }
     
     onNewMessage(callback: (message: any) => void) {
       this.socket.on('new_message', callback);
     }
     
     onUserJoined(callback: (user: any) => void) {
       this.socket.on('user_joined', callback);
     }
     
     onUserLeft(callback: (user: any) => void) {
       this.socket.on('user_left', callback);
     }
     
     disconnect() {
       this.socket.disconnect();
     }
   }
   ```

### Server-Sent Events (SSE)

1. **Server-side**
   ```typescript
   import express from 'express';
   
   const app = express();
   
   const clients = new Map<string, express.Response>();
   
   app.get('/events/:clientId', (req, res) => {
     const { clientId } = req.params;
     
     res.setHeader('Content-Type', 'text/event-stream');
     res.setHeader('Cache-Control', 'no-cache');
     res.setHeader('Connection', 'keep-alive');
     res.flushHeaders();
     
     clients.set(clientId, res);
     
     res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
     
     req.on('close', () => {
       clients.delete(clientId);
     });
   });
   
   function sendEvent(clientId: string, event: string, data: any) {
     const client = clients.get(clientId);
     if (client) {
       client.write(`event: ${event}\n`);
       client.write(`data: ${JSON.stringify(data)}\n\n`);
     }
   }
   
   function broadcast(event: string, data: any) {
     const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
     clients.forEach((client) => client.write(message));
   }
   
   app.listen(3000);
   ```

2. **Client-side**
   ```typescript
   class SSEClient {
     private eventSource: EventSource | null = null;
     private handlers = new Map<string, Set<(data: any) => void>>();
     
     connect(url: string) {
       this.eventSource = new EventSource(url);
       
       this.eventSource.onopen = () => {
         console.log('SSE connected');
       };
       
       this.eventSource.onerror = (error) => {
         console.error('SSE error:', error);
       };
       
       this.eventSource.onmessage = (event) => {
         const data = JSON.parse(event.data);
         this.handleMessage('message', data);
       };
     }
     
     on(event: string, handler: (data: any) => void) {
       if (!this.handlers.has(event)) {
         this.handlers.set(event, new Set());
         
         if (this.eventSource) {
           this.eventSource.addEventListener(event, (e: MessageEvent) => {
             const data = JSON.parse(e.data);
             this.handleMessage(event, data);
           });
         }
       }
       this.handlers.get(event)!.add(handler);
     }
     
     private handleMessage(event: string, data: any) {
       this.handlers.get(event)?.forEach((handler) => handler(data));
     }
     
     disconnect() {
       this.eventSource?.close();
     }
   }
   ```

### Presence and Heartbeat

```typescript
const heartbeatInterval = 30000;

wss.on('connection', (ws) => {
  let isAlive = true;
  
  ws.on('pong', () => {
    isAlive = true;
  });
  
  const interval = setInterval(() => {
    if (!isAlive) {
      ws.terminate();
      return;
    }
    
    isAlive = false;
    ws.ping();
  }, heartbeatInterval);
  
  ws.on('close', () => {
    clearInterval(interval);
  });
});
```

## Output Contract
- WebSocket server implementations
- Client connection handling
- Room management logic
- Reconnection strategies
- Event handling patterns

## Constraints
- Handle reconnection gracefully
- Implement heartbeat/ping-pong
- Validate messages
- Handle authentication
- Consider scaling (Redis adapter)

## Examples

### Example 1: Chat Application
```typescript
io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    socket.to(room).emit('user_joined', socket.id);
  });
  
  socket.on('message', ({ room, text }) => {
    io.to(room).emit('message', {
      user: socket.id,
      text,
      time: Date.now(),
    });
  });
});
```

### Example 2: Live Notifications
```typescript
function notifyUser(userId: string, notification: Notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}

socket.on('subscribe', () => {
  socket.join(`user:${socket.data.user.id}`);
});
```
