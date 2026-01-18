# SocialUp - Meetup Clone

A full-stack web application for organizing and discovering local events and meetups.

## Features

- User authentication and authorization
- Event creation, management, and discovery
- RSVP system with capacity management
- Comments and discussions on events
- User profiles with interests and bio
- Personalized dashboard and event feed
- Search and filter events by category, location, date
- Google Maps integration for event locations
- Admin panel for moderation
- Responsive design for all devices

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- express-validator for input validation
- multer for file uploads

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Hook Form for form handling
- date-fns for date formatting
- Google Maps API for location display

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Google Maps API key (optional, for map features)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

4. Start the server:
```bash
npm run server
```

Server will run on http://localhost:3000

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get own profile
- `PUT /api/users/me` - Update own profile
- `POST /api/users/me/avatar` - Upload profile picture
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/events` - Get user's events
- `GET /api/users/search?q=query` - Search users

### Events
- `GET /api/events` - List all events (with filters)
- `GET /api/events/search?q=query` - Search events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event
- `DELETE /api/events/:id/rsvp` - Cancel RSVP

### Comments
- `GET /api/events/:id/comments` - Get event comments
- `POST /api/events/:id/comments` - Add comment
- `DELETE /api/events/:id/comments/:commentId` - Delete comment

### Dashboard
- `GET /api/dashboard/upcoming` - Get upcoming events
- `GET /api/dashboard/feed` - Get personalized feed
- `GET /api/dashboard/stats` - Get user statistics

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/events` - List all events
- `DELETE /api/admin/comments/:id` - Delete comment
- `DELETE /api/admin/events/:id` - Delete event

## Project Structure

```
SocialUp-A-Meetup-Application/
├── server/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Middleware functions
│   │   └── utils/           # Utility functions
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

## Testing

See `TESTING_CHECKLIST.md` for comprehensive testing checklist.

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Protected routes with authentication middleware
- Role-based access control (admin/user)
- CORS configuration
- Helmet security headers

## Deployment

### Backend
- Deploy to Heroku, Railway, or AWS
- Set environment variables in hosting platform
- Ensure MongoDB Atlas connection is accessible

### Frontend
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Set environment variables in hosting platform

## License

ISC
