# RicozAssist Frontend

This is the React frontend for the RicozAssist enterprise AI assistant application.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- RicozAssist backend running on `http://localhost:8080/api/v1`

## Setup Instructions

### 1. Install Dependencies

```bash
cd ricoz-assist-frontend
npm install
```

### 2. Configure Environment Variables

The frontend uses the following environment variables (configured in `.env.development`):

```bash
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=RicozAssist
```

### 3. Start the Backend

Ensure the Spring Boot backend is running:

```bash
# From the project root
cd ricoz-assist-presentation
mvn spring-boot:run
```

The backend should be available at `http://localhost:8080/api/v1`

### 4. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Features

- **Authentication**: Login and registration with JWT tokens
- **Dashboard**: Overview of documents, meetings, and action items
- **Documents**: Create, read, search, and delete documents
- **Knowledge Bases**: Manage knowledge bases and indexing
- **Meetings**: Schedule and manage meetings with transcription support
- **Action Items**: Track and complete action items
- **AI Queries**: Submit queries to the AI assistant

## Project Structure

```
src/
├── components/
│   ├── common/       # Reusable UI components
│   ├── layout/       # Layout components (Sidebar, Header, etc.)
│   └── auth/         # Authentication components
├── pages/            # Page components
├── services/         # API service layer
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## API Integration

The frontend integrates with the backend API using Axios. All API calls are centralized in the `services/` directory:

- `authService.ts` - Authentication endpoints
- `userService.ts` - User management
- `documentService.ts` - Document operations
- `knowledgeBaseService.ts` - Knowledge base operations
- `meetingService.ts` - Meeting operations
- `actionItemService.ts` - Action item operations
- `queryService.ts` - AI query operations

## Authentication Flow

1. User logs in via `/login`
2. JWT token is stored in localStorage
3. Token is included in Authorization header for all API requests
4. 401 responses trigger redirect to login
5. Logout clears token and redirects to login

## State Management

State is managed using Zustand:
- `authStore` - User authentication state
- `uiStore` - UI state (sidebar, toasts)

## Technologies

- React 18 with TypeScript
- Vite for build tooling
- React Router v6 for routing
- Axios for API communication
- Zustand for state management
- TailwindCSS for styling
- React Hook Form + Zod for form validation
- date-fns for date handling
- Lucide React for icons

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend CORS configuration includes your frontend origin:
- Backend default: `http://localhost:3000`
- Configure via `CORS_ALLOWED_ORIGINS` environment variable

### Backend Not Responding
Ensure the backend is running and accessible at `http://localhost:8080/api/v1`

### Build Errors
Run `npm install` to ensure all dependencies are installed

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist/` folder to your web server or CDN

3. Update `VITE_API_URL` in `.env.production` to point to your production API

## License

MIT
