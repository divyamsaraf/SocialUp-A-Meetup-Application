# Phase 1 Cursor AI Prompt – SocialUp MVP Development

**Status:** Ready for Implementation (After Phase 0 Approval)  
**Reference:** See `ANALYSIS_REPORT.md` for complete Phase 0 analysis  
**Objective:** Build a fully functional SocialUp MVP (Meetup clone) with frontend and backend fully implemented according to the approved Phase 0 analysis.

---

## ⚠️ CRITICAL: Pre-Implementation Checklist

**DO NOT START CODING UNTIL:**
- [ ] Phase 0 analysis report has been reviewed and approved
- [ ] All clarifying questions (Section 7 of ANALYSIS_REPORT.md) are answered
- [ ] Tech stack recommendations (Section 1.3) are confirmed
- [ ] Phase 1 MVP plan (Section 6) is approved
- [ ] Explicit "proceed with Phase 1" instruction received

**Once approved, follow this guide exactly.**

---

## 1. Project Structure

### 1.1 Backend (Node.js + Express + MongoDB)

**Folder Structure:**
```
server/
├── src/
│   ├── config/           # DB, env, constants
│   │   ├── db.js         # MongoDB connection
│   │   ├── env.js        # Environment variables validation
│   │   └── constants.js  # App constants
│   ├── controllers/      # Request/response logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── event.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── comment.controller.js
│   │   └── admin.controller.js
│   ├── models/           # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── event.model.js
│   │   ├── group.model.js
│   │   └── comment.model.js
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── event.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── comment.routes.js
│   │   └── admin.routes.js
│   ├── services/         # Business logic
│   │   ├── auth.service.js
│   │   ├── event.service.js
│   │   ├── rsvp.service.js
│   │   ├── search.service.js
│   │   └── comment.service.js
│   ├── middlewares/      # Middleware functions
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── utils/            # Helper functions
│   │   ├── logger.js
│   │   └── helpers.js
│   └── server.js         # Express app entry point
├── .env                  # Environment variables (NOT in git)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
└── package.json
```

**Backend Requirements:**
- **Authentication:** JWT (httpOnly cookies preferred, or localStorage with security notes)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Logging:** morgan
- **Security:** helmet, cors (configured)
- **File Upload:** multer (profile pictures + event images)
- **Database:** MongoDB Atlas
- **Error Handling:** Centralized middleware
- **Endpoints:** Follow Phase 0 approved API summary (Section 6.5 of ANALYSIS_REPORT.md)

### 1.2 Frontend (React 18+)

**Folder Structure:**
```
client/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventList.jsx
│   │   │   ├── EventForm.jsx
│   │   │   └── RSVPButton.jsx
│   │   ├── comments/
│   │   │   └── CommentSection.jsx
│   │   ├── filters/
│   │   │   └── FilterBar.jsx
│   │   └── maps/
│   │       └── MapComponent.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EventList.jsx
│   │   ├── EventDetails.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── EditEvent.jsx
│   │   ├── Profile.jsx
│   │   └── AdminPanel.jsx
│   ├── contexts/         # Context providers
│   │   ├── AuthContext.jsx
│   │   └── EventContext.jsx
│   ├── services/         # API calls
│   │   ├── api.js        # Axios instance
│   │   ├── auth.service.js
│   │   ├── event.service.js
│   │   ├── user.service.js
│   │   └── dashboard.service.js
│   ├── utils/            # Helper functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── routes/           # React Router setup
│   │   └── AppRoutes.jsx
│   ├── App.jsx
│   └── index.js
├── public/
├── .env                  # Frontend environment variables
├── .env.example
├── .gitignore
└── package.json
```

**Frontend Requirements:**
- **Routing:** React Router DOM 6+
- **State Management:** React Context (or Redux Toolkit if complex)
- **UI Framework:** Tailwind CSS (or Material-UI)
- **Forms:** React Hook Form
- **Date Handling:** date-fns
- **Geolocation & Maps:** Google Maps API / Mapbox
- **HTTP Client:** Axios
- **Features:** Search, filters, RSVP, dashboard, event details, profile pages

---

## 2. Core MVP Features (Must Include)

### 2.1 Authentication (MVP)

- [ ] User registration and login (JWT)
- [ ] Password hashing and validation
- [ ] Session management with token refresh
- [ ] Protected routes for user and event actions
- [ ] Optional: Google OAuth login (Advanced)

**Implementation Notes:**
- Store JWT in httpOnly cookies (preferred) or localStorage with clear security documentation
- Implement token refresh mechanism
- Add password strength validation
- Email format validation

### 2.2 User Profiles (MVP)

- [ ] View/edit profile
- [ ] Upload profile picture (multer)
- [ ] Bio and interests
- [ ] Dashboard showing RSVP'd events
- [ ] Event creation history

**Implementation Notes:**
- Profile image upload with multer
- Validate image file types and sizes
- Display user's created events and RSVP'd events

### 2.3 Events (MVP)

- [ ] Create, update, delete events (owner only)
- [ ] Event details page with RSVP, attendees list
- [ ] Event images (upload and display)
- [ ] Event search/filter (category, date, type, location)
- [ ] Geolocation for location-based search
- [ ] Comments for events (create, delete own comments)
- [ ] RSVP join/leave functionality
- [ ] Event status: upcoming, past, cancelled
- [ ] Max attendees/capacity

**Implementation Notes:**
- Only event owner can edit/delete
- RSVP must check capacity limits
- Comments: only owner/admin can delete
- Event status automatically updates based on date
- Location should include address, city, coordinates

### 2.4 Dashboard / Feed (MVP)

- [ ] Personalized event feed based on RSVP history and interests
- [ ] Upcoming events view
- [ ] RSVP counts displayed
- [ ] Like/favorite events (optional MVP)

**Implementation Notes:**
- Feed algorithm: prioritize events matching user interests
- Show events user RSVP'd to
- Sort by upcoming date
- Display RSVP counts prominently

### 2.5 Admin Panel (Basic) (MVP)

- [ ] List all users
- [ ] List all events
- [ ] Moderate comments (delete reported comments)
- [ ] Delete inappropriate events

**Implementation Notes:**
- Admin role check middleware
- Basic UI for moderation
- Protect admin routes

---

## 3. Backend Tasks (Phase 1)

### Step 1 – Setup & Security

**Tasks:**
- [ ] Initialize Node.js project with proper structure
- [ ] Setup `.env` file with `JWT_SECRET` and `MONGODB_URI`
- [ ] Create `.env.example` template
- [ ] Add `.gitignore` (exclude `.env`, `node_modules`, etc.)
- [ ] Configure Express, CORS, Helmet, Morgan
- [ ] Connect to MongoDB Atlas
- [ ] Setup error handling middleware
- [ ] Configure multer for file uploads

**Key Files:**
- `server/src/config/db.js` - MongoDB connection
- `server/src/config/env.js` - Environment validation
- `server/src/middlewares/errorHandler.js` - Centralized error handling
- `server/src/server.js` - Express app setup

### Step 2 – Models

**User Model:**
```javascript
{
  username: String,
  email: String (unique, required),
  password: String (required, hashed),
  name: String,
  location: String,
  interests: [String] (default: []),
  profile_pic: String,
  bio: String,
  role: String (enum: ['user', 'admin'], default: 'user'),
  timestamps: true
}
```

**Event Model:**
```javascript
{
  title: String (required),
  description: String (required),
  hostedBy: ObjectId (ref: 'user', required),
  dateAndTime: Date (required),
  eventType: String (enum: ['event', 'group']),
  eventCategory: String (required),
  eventLocationType: String (enum: ['online', 'in-person']),
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  eventImage: String,
  maxAttendees: Number,
  attendees: [ObjectId] (ref: 'user', default: []),
  eventStatus: String (enum: ['upcoming', 'past', 'cancelled'], default: 'upcoming'),
  timestamps: true
}
```

**Comment Model:**
```javascript
{
  eventId: ObjectId (ref: 'event', required),
  userId: ObjectId (ref: 'user', required),
  text: String (required),
  timestamps: true
}
```

**Group Model (Optional for MVP, can defer to Advanced):**
```javascript
{
  name: String (required),
  description: String (required),
  category: String (required),
  organizer: ObjectId (ref: 'user', required),
  members: [ObjectId] (ref: 'user', default: []),
  privacy: String (enum: ['public', 'private']),
  groupImage: String,
  timestamps: true
}
```

### Step 3 – Controllers & Services

**UserController:**
- `register` - User registration
- `login` - User login
- `getProfile` - Get current user profile
- `updateProfile` - Update own profile
- `uploadAvatar` - Upload profile picture
- `getUserEvents` - Get user's created events
- `getUserRSVPs` - Get user's RSVP'd events

**EventController:**
- `createEvent` - Create new event (authenticated)
- `getEvents` - List all events (with filters)
- `getEventById` - Get event details
- `updateEvent` - Update event (owner only)
- `deleteEvent` - Delete event (owner only)
- `searchEvents` - Search events with filters
- `rsvpEvent` - RSVP to event (authenticated)
- `cancelRSVP` - Cancel RSVP (authenticated)

**CommentController:**
- `addComment` - Add comment to event (authenticated)
- `getComments` - Get all comments for event
- `deleteComment` - Delete comment (owner/admin)

**DashboardController:**
- `getUpcoming` - Get user's upcoming events
- `getFeed` - Personalized feed
- `getStats` - User statistics

**AdminController:**
- `getUsers` - List all users (admin only)
- `getEvents` - List all events (admin only)
- `deleteComment` - Moderate comment (admin)
- `deleteEvent` - Remove event (admin)

**Services:**
- `rsvp.service.js` - RSVP logic (capacity checks, add/remove attendees)
- `search.service.js` - Search and filter logic
- `event.service.js` - Event business logic (status updates, validation)
- `comment.service.js` - Comment management

### Step 4 – Routes

**Route Structure:**
```
/api/auth/*
  POST /register
  POST /login
  GET /me (authenticated)

/api/users/*
  GET /me (authenticated)
  PUT /me (authenticated)
  POST /me/avatar (authenticated)
  GET /:id
  GET /:id/events
  GET /:id/rsvps

/api/events/*
  GET / (with query filters)
  GET /search (search endpoint)
  GET /:id
  POST / (authenticated)
  PUT /:id (authenticated, owner)
  DELETE /:id (authenticated, owner)
  POST /:id/rsvp (authenticated)
  DELETE /:id/rsvp (authenticated)
  POST /:id/comments (authenticated)
  GET /:id/comments
  DELETE /:id/comments/:commentId (owner/admin)

/api/dashboard/*
  GET /upcoming (authenticated)
  GET /feed (authenticated)
  GET /stats (authenticated)

/api/admin/*
  GET /users (admin only)
  GET /events (admin only)
  DELETE /comments/:id (admin)
  DELETE /events/:id (admin)
```

### Step 5 – Middleware

**Authentication Middleware:**
- Verify JWT token
- Attach user to request object
- Handle token expiration

**Authorization Middleware:**
- Check if user is owner (for event edit/delete)
- Check if user is admin (for admin routes)

**Validation Middleware:**
- Use express-validator for request validation
- Validate all inputs (email, password, event data, etc.)

**Error Handling Middleware:**
- Centralized error handling
- Consistent error response format
- Log errors appropriately

---

## 4. Frontend Tasks (Phase 1)

### Step 1 – Setup

**Tasks:**
- [ ] Create React project (Vite recommended for faster setup)
- [ ] Install dependencies:
  - `react-router-dom` - Routing
  - `axios` - HTTP client
  - `react-hook-form` - Form handling
  - `date-fns` - Date formatting
  - `tailwindcss` or Material-UI - UI framework
  - `@react-google-maps/api` or Mapbox - Maps integration
- [ ] Setup Tailwind CSS (if using)
- [ ] Configure environment variables
- [ ] Setup Axios instance with base URL

### Step 2 – Pages

**Login.jsx:**
- Email/password form
- Link to register
- Error handling
- Redirect to dashboard on success

**Register.jsx:**
- Registration form (name, email, password, confirm password)
- Validation
- Link to login
- Redirect to dashboard on success

**Dashboard.jsx:**
- Personalized event feed
- Upcoming events section
- User stats (events created, RSVPs)
- Filter by interests

**EventList.jsx:**
- Display all events with EventCard components
- Search bar
- FilterBar component (category, date, location type)
- Pagination
- Map view toggle (optional)

**EventDetails.jsx:**
- Full event information
- RSVPButton component
- Attendees list
- CommentSection component
- Edit/Delete buttons (owner only)
- Map showing event location

**CreateEvent.jsx:**
- Event creation form
- Image upload
- Location input (address + map picker)
- Date/time picker
- Category selection
- Validation

**EditEvent.jsx:**
- Pre-filled form with event data
- Same as CreateEvent but for editing
- Owner only access

**Profile.jsx:**
- User profile information
- Edit profile form
- Profile image upload
- User's events list
- User's RSVPs list

**AdminPanel.jsx:**
- Users list (admin only)
- Events list (admin only)
- Comment moderation interface
- Delete actions

### Step 3 – Components

**Navbar.jsx:**
- Logo/brand
- Navigation links
- User menu (profile, logout)
- Search bar (optional)

**EventCard.jsx:**
- Event image
- Title, date, location
- Category badge
- RSVP count
- Link to event details

**CommentSection.jsx:**
- Display comments
- Add comment form (authenticated)
- Delete button (owner/admin)
- User avatars

**RSVPButton.jsx:**
- RSVP status (attending/interested/not RSVP'd)
- Toggle RSVP
- Show capacity if maxAttendees set

**FilterBar.jsx:**
- Category filter
- Date range filter
- Location type filter (online/in-person)
- Location radius (if geolocation enabled)
- Clear filters button

**MapComponent.jsx:**
- Display events on map
- Event markers
- Click marker to view event details
- User location (if geolocation enabled)

### Step 4 – Context / State

**AuthContext.jsx:**
- Store JWT token
- User state
- Login/logout functions
- Check authentication status
- Provide auth state to all components

**EventContext.jsx (Optional):**
- Global event state
- Event actions (create, update, delete)
- Filter state

**API Service:**
- Axios instance with base URL
- Request interceptors (add token)
- Response interceptors (handle errors)
- Service functions for each endpoint

### Step 5 – Integrations

**Geolocation:**
- Detect user location (browser geolocation API)
- Use for location-based search
- Display user location on map

**Map Display:**
- Google Maps or Mapbox integration
- Show events as markers
- Click marker for event details
- Show event location on event details page

**Search & Filter:**
- Search by title, description
- Filter by category, date range, location type
- Location radius search (if coordinates available)
- Real-time search results

**RSVP Functionality:**
- Join/leave event
- Check capacity limits
- Update attendee count
- Show RSVP status

**Dashboard Feed:**
- Personalized algorithm based on:
  - User interests
  - RSVP history
  - Event categories
- Sort by upcoming date
- Display RSVP counts

---

## 5. Feature Implementation Notes

### General Requirements

- **All endpoints must return JSON** with proper status codes
- **Frontend should handle loading/error states** (loading spinners, error messages)
- **Responsive design** for all pages (mobile, tablet, desktop)
- **Use environment variables** for API URLs and keys
- **Input validation and sanitization** both backend & frontend
- **Secure JWT** in httpOnly cookies (preferred) or localStorage with clear security notes
- **Error handling** - consistent error messages and status codes

### Specific Feature Notes

**Comments:**
- Only comment owners and admins can delete comments
- Display user avatar and name with comment
- Show timestamp (relative time, e.g., "2 hours ago")

**RSVP:**
- Enforce maxAttendees limit
- Show capacity status (e.g., "15/20 attendees")
- Handle waitlist if needed (optional)
- Update attendee count in real-time

**Dashboard Feed:**
- Sort by upcoming events first
- Filter by user interests
- Show events user RSVP'd to
- Display personalized recommendations

**Search:**
- Search by title, description
- Filter by category, date range, location type
- Location radius search (if geolocation enabled)
- Real-time results as user types (optional)

**Event Status:**
- Automatically update status based on date
- "Upcoming" for future events
- "Past" for past events
- "Cancelled" for manually cancelled events

---

## 6. Deliverables

### Backend Deliverables
- [ ] Fully functional REST API with all endpoints
- [ ] All models implemented (User, Event, Comment)
- [ ] Authentication and authorization working
- [ ] File upload working (profile pictures, event images)
- [ ] Error handling middleware
- [ ] Input validation on all endpoints
- [ ] Environment variables configured
- [ ] MongoDB Atlas connected
- [ ] API documentation (Swagger/OpenAPI or README)

### Frontend Deliverables
- [ ] All pages implemented and functional
- [ ] All components created and reusable
- [ ] Authentication flow working (login, register, logout)
- [ ] Event CRUD operations working
- [ ] RSVP functionality working
- [ ] Comments working
- [ ] Search and filters working
- [ ] Dashboard feed working
- [ ] Admin panel functional (if admin user)
- [ ] Responsive design
- [ ] Error handling and loading states

### Database Deliverables
- [ ] MongoDB Atlas collections: Users, Events, Comments
- [ ] Proper indexes on frequently queried fields
- [ ] Data relationships working (populate references)

### Code Quality Deliverables
- [ ] Code is linted and formatted
- [ ] Consistent code structure
- [ ] Proper error handling
- [ ] Comments where necessary
- [ ] Environment variables documented
- [ ] README with setup instructions

---

## 7. Cursor AI Instructions

### Pre-Implementation
1. **Confirm Phase 0 Approval**
   - Verify all Phase 0 deliverables are approved
   - Check that clarifying questions are answered
   - Ensure tech stack is confirmed

2. **Review Analysis Report**
   - Read `ANALYSIS_REPORT.md` thoroughly
   - Understand current state and gaps
   - Reference action items table (Section 0)

### Implementation Order

**Week 1: Backend Foundation**
1. Setup project structure
2. Environment configuration
3. Security fixes (move secrets to .env)
4. Database connection
5. Models implementation
6. Authentication middleware

**Week 2: Backend Core Features**
1. User endpoints
2. Event endpoints
3. RSVP functionality
4. Comment endpoints
5. Search and filter logic

**Week 3: Backend Advanced & Frontend Setup**
1. Dashboard endpoints
2. Admin endpoints
3. Frontend project setup
4. Authentication pages
5. Basic routing

**Week 4: Frontend Core Features**
1. Event pages (list, details, create, edit)
2. Profile pages
3. Dashboard/feed
4. Search and filters
5. RSVP functionality

**Week 5: Frontend Polish & Integration**
1. Comments implementation
2. Admin panel
3. Map integration
4. Geolocation
5. UI/UX polish
6. Error handling
7. Testing and bug fixes

### Implementation Guidelines

1. **Follow Architecture Strictly**
   - Use exact folder structure specified
   - Separate routes, controllers, services
   - Use middleware for auth, validation, errors

2. **Follow Endpoints Exactly**
   - Use API summary from Phase 0 (Section 6.5)
   - Consistent response formats
   - Proper status codes

3. **Follow Schemas Exactly**
   - Use database schemas from Phase 0 (Section 6.4)
   - Proper data types
   - Required fields enforced

4. **Focus on MVP First**
   - Implement MVP features before advanced
   - Ensure core functionality works end-to-end
   - Test each feature as you build

5. **Code Quality**
   - Clean, maintainable code
   - Proper error handling
   - Input validation
   - Security best practices

6. **Progress Checkpoints**
   - After Week 1: Backend foundation complete
   - After Week 2: Backend core features complete
   - After Week 3: Frontend setup and auth complete
   - After Week 4: Frontend core features complete
   - After Week 5: Full MVP complete and tested

### Testing Requirements

- [ ] Test all authentication flows
- [ ] Test event CRUD operations
- [ ] Test RSVP functionality
- [ ] Test search and filters
- [ ] Test comments
- [ ] Test admin panel
- [ ] Test error handling
- [ ] Test responsive design
- [ ] End-to-end user flows

### Final Checklist

Before marking Phase 1 complete:
- [ ] All MVP features implemented
- [ ] All endpoints working
- [ ] Frontend fully integrated with backend
- [ ] Authentication and authorization working
- [ ] Search, filters, RSVP, dashboard all functional
- [ ] Admin panel working
- [ ] Code is clean and maintainable
- [ ] README with setup instructions
- [ ] Environment variables documented
- [ ] No critical bugs
- [ ] Responsive design verified

---

## 8. Reference Documents

- **Phase 0 Analysis:** `ANALYSIS_REPORT.md`
  - Section 0: Action Items Table
  - Section 1: Repository Structure
  - Section 3: Feature Gaps
  - Section 4: Technical Debt
  - Section 5: Technical Recommendations
  - Section 6: Phase 1 MVP Plan
  - Section 6.4: Database Schema Updates
  - Section 6.5: API Endpoints Summary

---

**Status:** Ready for Implementation  
**Next Step:** Wait for Phase 0 approval, then begin Week 1: Backend Foundation

---

*End of Phase 1 Implementation Guide*
