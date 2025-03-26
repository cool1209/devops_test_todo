# DevOps Todo Application

This project is a full-stack todo application that showcases both development and DevOps skills. It features a NestJS backend with Apollo GraphQL, a MongoDB database, a React frontend with Apollo Client, and integrations with Redis and RabbitMQ. On the DevOps side, it includes containerization with Docker, orchestration with Docker Compose, and log management using the ELK Stack.

## Architecture

The application consists of the following components:

- **Backend**: NestJS with Apollo GraphQL and TypeScript
- **Frontend**: React with Apollo Client and TypeScript
- **Database**: MongoDB for persistent storage
- **Caching**: Redis for caching todo items
- **Message Queue**: RabbitMQ for handling asynchronous tasks
- **Log Management**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Prerequisites

- Docker and Docker Compose installed on your machine

## Getting Started

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd devops_todo
   ```

2. Build and run the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend GraphQL Playground: http://localhost:4000/graphql
   - Kibana Dashboard: http://localhost:5601
   - RabbitMQ Management: http://localhost:15672 (username: guest, password: guest)

## Technical Details

### Backend (NestJS with Apollo GraphQL)

The backend is built with NestJS and Apollo GraphQL. It provides a GraphQL API for creating, reading, updating, and deleting todo items. The backend uses TypeScript for type safety.

Key components:
- GraphQL API with queries and mutations
- MongoDB integration for data persistence
- Redis for caching todo items to improve performance
- RabbitMQ for asynchronous task handling
- Structured JSON logging

### Frontend (React with Apollo Client)

The frontend is built with React and Apollo Client. It provides a user interface for managing todo items.

Key features:
- List, create, update, and delete todo items
- Mark todo items as completed
- Responsive design

### Docker Setup

The application is containerized using Docker, making it easy to run in any environment.

- Backend container: NestJS application
- Frontend container: React application with Nginx
- MongoDB container: Database
- Redis container: Caching
- RabbitMQ container: Message queue
- ELK Stack containers: Elasticsearch, Logstash, and Kibana for log management

### Docker Compose Configuration

Docker Compose is used to orchestrate all the containers, making it easy to start and stop the entire application stack.

### ELK Stack for Log Management

The ELK Stack (Elasticsearch, Logstash, Kibana) is used for centralized log management:
- The backend outputs structured JSON logs
- Logstash collects and processes logs from the application containers
- Elasticsearch stores and indexes the logs
- Kibana provides a web interface for visualizing and searching logs

A pre-configured Kibana dashboard is available to monitor todo creation events, updates, and errors.

## Redis and RabbitMQ Integration

### Redis Caching
Redis is used to cache todo items, reducing the number of database queries and improving performance. The caching strategy includes:
- Caching the list of todo items with a TTL (time-to-live) of 60 seconds
- Cache invalidation when todo items are created, updated, or deleted

### RabbitMQ Message Queue
RabbitMQ is used for handling asynchronous tasks. The application sends messages to a RabbitMQ queue when:
- A todo item is created
- A todo item is updated
- A todo item is deleted

## Development

If you want to run the application for development:

1. Backend development:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. Frontend development:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## License

MIT 