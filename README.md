# Backend Service

## Setup and Running Instructions

### Prerequisites
- Node.js
- Docker
- MongoDB (if not using Docker)

### Environment Variables
Create a `.env` file in the root directory with the following variables:
 - DATABASE_URL=mongodb://localhost:27017/yourdb
 - JWT_SECRET=your_jwt_secret
 - API_SECRET=your_anthropic_api_secret
 - PORT=3000
 - REDIS_HOST=127.0.0.1
 - REDIS_PORT=6379

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/manavgoyal53/Manav-Goyal-AnswersAi-Backend
   cd Manav-Goyal-AnswersAi-Backend

2. Install dependencies:
    ```bash
    npm install

3. Run the app:
    ```bash
    npm start

### Running with Docker Compose

1. Use the following command
    ```bash
    docker compose-up --build

2. Change the following env variables in the docker-compose.yaml:
    - MONGO_URI=mongodb://mongodb_new:27017/answers_ai
    - REDIS_HOST=my_redis
    - REDIS_PORT=6379
