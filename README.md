# VisionBoard Pro

A full-stack Business Vision Board application for entrepreneurs to create, manage, and track measurable business goals. This is an execution-focused, data-driven CEO-level planning tool.

## Features

- **Comprehensive Vision Boards** - 8 essential sections covering:
  - Business Overview
  - Financial Goals
  - Growth Strategy
  - Product/Service Plan
  - Systems to Build
  - Team Plan
  - Brand Goals
  - Lifestyle Vision

- **Progress Tracking** - Monthly updates, actual vs target comparisons
- **AI-Powered Suggestions** - Intelligent recommendations based on your goals
- **Visual Mode** - Beautiful card-based view of your vision board
- **PDF Export** - Download and print your vision board
- **Dark/Light Mode** - Choose your preferred theme
- **Admin Dashboard** - User management and analytics

## Tech Stack

### Frontend
- React.js 18
- Vite
- Tailwind CSS
- React Router v6
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd visionboard-pro
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Copy the example env file
cp server/.env.example server/.env

# Edit the .env file with your configuration
# Update MONGODB_URI and JWT_SECRET
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the development servers:
```bash
npm run dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Alternative: Start servers separately

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Project Structure

```
visionboard-pro/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # UI components (Button, Card, Input, etc.)
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── visionboard/   # Vision board components
│   │   │   ├── progress/      # Progress tracking components
│   │   │   ├── admin/         # Admin panel components
│   │   │   └── settings/      # Settings components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   ├── pages/             # Page components
│   │   └── styles/            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                    # Node.js Backend
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Express middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   └── utils/                 # Utility functions
│
└── package.json               # Root package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Vision Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visionboards` | Get all user's vision boards |
| GET | `/api/visionboards/:id` | Get single vision board |
| POST | `/api/visionboards` | Create vision board |
| PUT | `/api/visionboards/:id` | Update vision board |
| DELETE | `/api/visionboards/:id` | Delete vision board |
| PUT | `/api/visionboards/:id/section/:sectionName` | Update specific section |

### Progress & Updates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/:visionBoardId` | Get progress history |
| POST | `/api/progress/:visionBoardId/monthly` | Add monthly update |
| GET | `/api/progress/:visionBoardId/comparison` | Get actual vs target |
| GET | `/api/progress/:visionBoardId/ai-suggestions` | Get AI suggestions |

### Admin (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/analytics` | Get analytics data |

## Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/visionboard-pro

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
# Serve the dist folder with any static file server
```

## Deployment

### Backend (Render/Railway/Heroku)
1. Push to GitHub
2. Connect to your hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Set `VITE_API_URL` to production backend URL

### MongoDB (Atlas)
1. Create MongoDB Atlas cluster
2. Whitelist IPs
3. Update `MONGODB_URI` in production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository.