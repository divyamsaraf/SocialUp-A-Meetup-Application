# SocialUp Client

React frontend application for SocialUp.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Or copy from `.env.example`:
```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Project Structure

```
client/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── common/       # Common components (Navbar, Loading, etc.)
│   ├── pages/            # Page components
│   ├── contexts/         # React Context providers
│   ├── services/         # API service layer
│   ├── utils/            # Helper functions and constants
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Static assets
└── package.json
```

## Features Implemented

### Week 3 (Current)
- ✅ Authentication (Login, Register)
- ✅ Protected Routes
- ✅ Dashboard (basic)
- ✅ API Integration
- ✅ Responsive Navbar

### Week 4 (Planned)
- Event listing page
- Event details page
- Create/Edit event
- RSVP functionality
- Profile pages

### Week 5 (Planned)
- Comments
- Admin panel
- Maps integration
- Search and filters
- UI/UX polish

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **date-fns** - Date utilities

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api`.

All API calls are handled through the `services/api.js` file which includes:
- Automatic token injection
- Error handling
- Request/response interceptors
