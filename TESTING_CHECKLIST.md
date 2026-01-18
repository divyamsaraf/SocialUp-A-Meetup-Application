# Testing Checklist

## Backend API Testing

### Authentication
- [ ] POST /api/auth/register - Register new user
- [ ] POST /api/auth/login - Login user
- [ ] GET /api/auth/me - Get current user (authenticated)
- [ ] Test invalid credentials
- [ ] Test duplicate email registration

### Users
- [ ] GET /api/users/me - Get own profile
- [ ] PUT /api/users/me - Update own profile
- [ ] POST /api/users/me/avatar - Upload profile picture
- [ ] GET /api/users/:id - Get user by ID
- [ ] GET /api/users/:id/events - Get user's events
- [ ] GET /api/users/search?q=query - Search users

### Events
- [ ] GET /api/events - List all events (with filters)
- [ ] GET /api/events/search?q=query - Search events
- [ ] GET /api/events/:id - Get event details
- [ ] POST /api/events - Create event (authenticated)
- [ ] PUT /api/events/:id - Update event (owner only)
- [ ] DELETE /api/events/:id - Delete event (owner only)
- [ ] POST /api/events/:id/rsvp - RSVP to event
- [ ] DELETE /api/events/:id/rsvp - Cancel RSVP
- [ ] Test event capacity limits
- [ ] Test event filters (category, location type, date)

### Comments
- [ ] GET /api/events/:id/comments - Get event comments
- [ ] POST /api/events/:id/comments - Add comment (authenticated)
- [ ] DELETE /api/events/:id/comments/:commentId - Delete comment (owner/admin)

### Dashboard
- [ ] GET /api/dashboard/upcoming - Get upcoming events
- [ ] GET /api/dashboard/feed - Get personalized feed
- [ ] GET /api/dashboard/stats - Get user statistics

### Admin
- [ ] GET /api/admin/users - List all users (admin only)
- [ ] GET /api/admin/events - List all events (admin only)
- [ ] DELETE /api/admin/comments/:id - Delete comment (admin)
- [ ] DELETE /api/admin/events/:id - Delete event (admin)
- [ ] Test admin access restrictions

## Frontend Testing

### Authentication Flow
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Protected routes redirect to login
- [ ] Token persistence on page refresh

### Event Management
- [ ] View events list
- [ ] Search events
- [ ] Filter events by category
- [ ] Filter events by location type
- [ ] View event details
- [ ] Create new event
- [ ] Edit own event
- [ ] Delete own event
- [ ] Cannot edit/delete other users' events
- [ ] RSVP to event
- [ ] Cancel RSVP
- [ ] Event capacity enforcement
- [ ] Map view toggle
- [ ] Map displays event locations

### Comments
- [ ] View comments on event
- [ ] Add comment (authenticated)
- [ ] Delete own comment
- [ ] Admin can delete any comment
- [ ] Cannot delete other users' comments

### Profile
- [ ] View own profile
- [ ] View other users' profiles
- [ ] Edit own profile
- [ ] Upload profile picture
- [ ] Update interests
- [ ] View user's created events

### Dashboard
- [ ] View dashboard stats
- [ ] View upcoming events
- [ ] View personalized feed
- [ ] Click event cards to navigate

### Admin Panel
- [ ] Admin can access admin panel
- [ ] Non-admin cannot access admin panel
- [ ] View all users
- [ ] View all events
- [ ] Delete events as admin
- [ ] Delete comments as admin

### UI/UX
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states display correctly
- [ ] Error messages display correctly
- [ ] Form validation works
- [ ] Navigation works correctly
- [ ] Footer displays on all pages

## Integration Testing

### End-to-End Flows
- [ ] Complete user registration and login flow
- [ ] Create event, RSVP, add comment flow
- [ ] Edit profile and upload avatar flow
- [ ] Search and filter events flow
- [ ] Admin moderation flow

### Error Scenarios
- [ ] Network errors handled gracefully
- [ ] 401 errors redirect to login
- [ ] 403 errors show appropriate message
- [ ] 404 errors handled
- [ ] Validation errors display correctly

## Performance Testing
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Large event lists paginate correctly
- [ ] Image uploads work correctly

## Security Testing
- [ ] JWT tokens stored securely
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] Users cannot access other users' data
- [ ] Input validation on all forms
- [ ] XSS prevention (sanitized inputs)
