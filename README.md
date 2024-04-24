
INTRODUCTION -
--------------------------------------------------------------------------------------------------------
In today's interconnected world, seamless collaboration on documents among multiple users is 
essential for productivity and efficiency. The Real-Time Collaborative Document Editor is a 
cutting-edge application designed to facilitate simultaneous editing of shared documents by 
multiple users in real time. This project harnesses the power of modern web technologies, 
including NestJS for the backend, WebSocket for real-time communication, and robust 
authentication mechanisms to ensure data security and user privacy


KEY-FEATURES ->
--------------------------------------------------------------------------------------------------------

  1. Real-Time Collaboration
  2. Document & users management
  3. Identification/mapping of websocket client with database user
  4. Authentication & Authorization
  5. Conflict Resolution
  6. Persistence
  7. Maintaining DTO’s (Data Transfer Object)
  8. Class-Validator & Class-Transformer

TECHNOLOGY STACK  ->
--------------------------------------------------------------------------------------------------------

  1. Frontend : ReactJS, state management(ContextAPI), TailwindCSS
  2. Backend : NestJS, WebSockets Gateway, Socket.io-client, Mongoose, Mongo-Atlas, JWT(JSON web token - HMAC with SHA-256), Typescript

PROJECT STRUCTURE ->
--------------------------------------------------------------------------------------------------------

Realtime-collaborative-doc-editor/
│
├── src/
│ ├── app.module.ts // Main module
│ ├── document/ // Document module
│ │ ├── document.controller.ts // Document controller
│ │ ├── document.service.ts // Document service
│ │ ├── document.entity.ts // Document entity (Mongoose)
│ │ └── document.module.ts // Document module definition
│ │
│ ├── auth/ // Authentication module
│ │ ├── auth.controller.ts // Auth controller (login, register)
│ │ ├── auth.service.ts // Auth service (JWT authentication)
│ │ └── auth.module.ts // Auth module definition
│ │ └── jwt.strategy.ts 
│ │ └── guards
│ │ ├── jwt-guards.auth.ts // JWT guard for authentication
│ │
│ ├── user/ // User module
│ │ ├── user.controller.ts // User controller
│ │ ├── user.service.ts // User service
│ │ ├── user.entity.ts // User entity (Mongoose)
│ │ └── user.module.ts // User module definition
│ ├── socket.gateway.ts // WebSocket gateway
│ │
│ └── main.ts // Entry point for the application
├── .env // Environment variables
└── package.json // Project dependencies and scripts


VIDEO-DEMO URL ->
--------------------------------------------------------------------------------------------------------


  1. Frontend :
      
       Part 1 - https://www.loom.com/share/ef97f7ba1e16435baf3506f7e2333ab8?sid=9ab4cb8c-39a9-48ea-9cde-c55c023b6e76

       Part 2 - https://www.loom.com/share/db0d9a09a1a64a1196e2fb717db1fea2?sid=82fe327b-9ff7-4d4b-88e8-871ac0c95c7b
     
  3. Backend :
                https://www.loom.com/share/d32ac1f69e454fbab57841eb05fe958a?sid=1b64a82b-9707-4481-908b-3f087d283069
     
PROJECT SNAPSHOTS ->
--------------------------------------------------------------------------------------------------------


![Screenshot (21)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/bf03a889-d6cb-477f-8c99-65edc7b7cced)

![Screenshot (22)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/4dc5290b-8d79-4d39-a32e-d8917e7eb8a1)

![Screenshot (27)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/83fcd4cc-1e9e-4129-881a-6e31e4b98f73)

![Screenshot (30)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/dd043a3a-bfce-436c-842d-72afe1d1328d)

![Screenshot (33)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/bcb569e2-bbb3-4994-a920-8223a292e9b2)

![Screenshot (35)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/e340aa0d-4315-427b-84c3-c79c0e714670)

![Screenshot (25)](https://github.com/tikhepooja11/Realtime-collaborative-document-editor-app/assets/47672660/9ca3c34e-c95c-4b62-8a48-7899d934b305)
