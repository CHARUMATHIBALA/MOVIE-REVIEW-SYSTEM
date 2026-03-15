# Movie Review System Backend

A complete RESTful API backend for the Movie Review System with MongoDB integration, user authentication, and full CRUD operations.

## 🚀 Features

- **User Authentication**: Registration, login, JWT-based authentication
- **Role-Based Access**: Admin and user roles
- **Movie Management**: Full CRUD operations for movies
- **Review System**: Create, read, update, delete reviews
- **MongoDB Integration**: Persistent data storage
- **Security**: Password hashing, JWT tokens, input validation
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie_review_db
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For Windows
   net start MongoDB

   # For macOS/Linux
   sudo systemctl start mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/update-profile` | Update profile | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Movies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/movies` | Get all movies | No |
| GET | `/api/movies/:id` | Get single movie | No |
| POST | `/api/movies` | Create movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |
| GET | `/api/movies/search/:query` | Search movies | No |
| GET | `/api/movies/top-rated` | Get top rated movies | No |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/movie/:movieId` | Get movie reviews | No |
| GET | `/api/reviews/user` | Get user's reviews | Yes |
| POST | `/api/reviews` | Create/update review | Yes |
| PUT | `/api/reviews/:id` | Update review | Owner/Admin |
| DELETE | `/api/reviews/:id` | Delete review | Owner/Admin |
| POST | `/api/reviews/:id/helpful` | Mark as helpful | No |
| POST | `/api/reviews/:id/not-helpful` | Mark as not helpful | No |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Receive JWT token upon successful login
2. **Authorization**: Include token in `Authorization: Bearer <token>` header
3. **Token Validation**: Middleware validates token on protected routes

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  title: String,
  year: Number,
  genre: String,
  rating: Number,
  poster: String,
  description: String,
  duration: String,
  director: String,
  cast: Array,
  reviews: Array (Review references),
  averageRating: Number,
  reviewCount: Number,
  isActive: Boolean
}
```

### Review Model
```javascript
{
  user: ObjectId (User reference),
  movie: ObjectId (Movie reference),
  rating: Number (1-5),
  comment: String,
  helpful: Number,
  notHelpful: Number,
  isActive: Boolean
}
```

## 🎯 Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## 🔧 Development

### Running Tests
```bash
npm test
```

### Database Seeding
```bash
# Seed Tamil movies data
npm run seed

# Or run directly
node utils/seed.js
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/movie_review_db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-production-secret
   ```

2. **Install production dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configured CORS for frontend
- **Rate Limiting**: Built-in protection (can be added)
- **Helmet**: Security headers middleware

## 📝 Example API Usage

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Movies
```bash
curl -X GET http://localhost:5000/api/movies
```

### Create Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "movie": "movie_id_here",
    "rating": 5,
    "comment": "Amazing movie!"
  }'
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **JWT Token Error**
   - Verify JWT_SECRET is set in `.env`
   - Check token format in Authorization header

3. **CORS Error**
   - Verify FRONTEND_URL matches your frontend URL
   - Check if frontend is running on correct port

4. **Validation Error**
   - Check request body format
   - Verify required fields are included

## 📞 Support

For any issues or questions, please check the console logs and error messages for detailed information.

## 📄 License

This project is licensed under the MIT License.
