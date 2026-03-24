# VisionBoard Pro

A full-stack Business Vision Board application for entrepreneurs and business leaders to create, manage, and track measurable business goals and strategic plans. This is an execution-focused, data-driven CEO-level planning tool built on modern business frameworks.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Modules](#modules)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Business Frameworks](#business-frameworks-implemented)
- [User Roles & Permissions](#user-roles--permissions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

**VisionBoard Pro** helps entrepreneurs define their business vision, set strategic goals, track progress, and execute with precision. Built on proven business frameworks like Scaling Up, OKRs, and SMART goals, it provides a comprehensive toolkit for business planning and execution.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **State Management** | React Context API |
| **Code Splitting** | React.lazy + Suspense |

---

## Core Features

### 1. Authentication System
- User registration with secure password hashing
- JWT-based authentication
- Protected routes for authenticated users
- Admin-only routes for user management
- Session management with token refresh

### 2. Vision Board Module
A comprehensive strategic planning module with 20+ sections:

| Section | Purpose |
|---------|---------|
| **Company Overview** | Business identity, industry, target customer profile |
| **Core Purpose** | Why the business exists beyond profit |
| **Vision** | 10+ year desired market position and impact |
| **Mission** | Daily actions and value delivery |
| **Brand Promise** | Commitment to customers |
| **Core Values** | Guiding principles and behaviors |
| **BHAG** | Big Hairy Audacious Goal (10-year target) |
| **Vivid Description** | Detailed future state visualization |
| **SWOT Analysis** | Strengths, Weaknesses, Opportunities, Threats |
| **Strategic Priorities** | Top 3-5 priorities with WWW actions |
| **3-Year Strategy** | Year-by-year objectives and initiatives |
| **SMART Goals** | Specific, Measurable, Achievable, Relevant, Time-bound goals |
| **Quarterly Plan** | Q1-Q4 execution themes and KPIs |
| **Revenue Model** | Revenue streams, targets, FP&A dashboard |
| **Organizational Structure** | FACe chart, PACe chart, talent assessment |
| **SOP Roadmap** | Standard Operating Procedures timeline |
| **Automation & Systems** | Core tools and key automations |
| **KPI Dashboard** | Financial, Sales, Operations, Customer, People KPIs |
| **Risk Management** | Risk identification and mitigation strategies |
| **Strategy Summary** | One-page strategic overview |

### 3. Progress Tracking
- Real-time progress calculation across all sections
- Visual progress bars at module and overall levels
- Data-driven progress (based on actual content, not just completion flags)
- Monthly update tracking

### 4. PDF Export System
- Full Vision Board export with all sections
- One-Page Strategy Summary (recommended)
- Professional formatting with custom styling
- Print-ready output

### 5. AI-Powered Features
- AI suggestions for goal alignment
- Risk scenario simulation
- "Ask Patrick" AI coaching (Business guidance)
- Smart recommendations based on data patterns

### 6. Admin Dashboard
- User management (CRUD operations)
- Analytics dashboard
- Platform-wide metrics
- User activity monitoring

---

## Modules

### Six Integrated Modules

| Module | Icon | Description |
|--------|------|-------------|
| **Vision Board** | 🎯 | Mission, Vision, BHAG, Core Values, SWOT |
| **Target Tracker** | 📊 | OKRs, SMART Goals, Milestones, Dependencies, KPI Dashboard |
| **Resource Management** | 👥 | FACe Chart, PACe Chart, Talent Assessment (9-box grid), Org Chart |
| **Execution & Risk** | ⚡ | WWW Actions, Rockefeller Habits, Risk Matrix, Project Portfolio |
| **Financial Insights** | 💰 | FP&A Dashboard, CASh Strategies, Forecasting, ROI Calculator |
| **Collaboration Hub** | 🤝 | Workspaces, Discussions, Mentorship, Knowledge Base, AI Coach |

### Module Details

#### 1. Vision Board (Planning)
- Define mission, vision, and core purpose
- Set BHAG (Big Hairy Audacious Goal)
- Establish core values and brand promise
- Conduct SWOT analysis
- Create vivid description of future state

#### 2. Target Tracker (Execution)
- Set OKRs (Objectives and Key Results)
- Create SMART goals with AI assistance
- Track milestones with visual timeline
- Map dependencies between goals
- Monitor KPI dashboard

#### 3. Resource Management (People)
- Build FACe Chart (Functional Accountability Chart)
- Create PACe Chart (Process Accountability Chart)
- Assess talent using 9-box grid
- Define organizational structure
- Manage team directory

#### 4. Execution & Risk (Execution)
- Track WWW (Who-What-When) actions
- Maintain Rockefeller Habits checklist
- Manage risk matrix with AI simulation
- Track project portfolio
- Monitor execution progress

#### 5. Financial Insights (Analytics)
- FP&A dashboard for financial health
- CASh strategies for cash acceleration
- Financial forecasting models
- ROI calculators for initiatives
- AI-powered financial analysis

#### 6. Collaboration Hub (People)
- Create shared workspaces
- Facilitate guided discussions
- Set up mentoring relationships
- Build knowledge base
- Access AI coach "Ask Patrick"

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  avatar: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### VisionBoards Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  name: String,
  isActive: Boolean,
  overallProgress: Number (0-100),
  sections: {
    // Legacy 8 sections (backward compatible)
    businessOverview: { completed: Boolean, data: {} },
    financialGoals: { completed: Boolean, data: {} },
    growthStrategy: { completed: Boolean, data: {} },
    productService: { completed: Boolean, data: {} },
    systemsToBuild: { completed: Boolean, data: {} },
    teamPlan: { completed: Boolean, data: {} },
    brandGoals: { completed: Boolean, data: {} },
    lifestyleVision: { completed: Boolean, data: {} }
  },
  strategySheet: {
    // New 20+ strategic sections
    companyOverview: { completed: Boolean, data: {} },
    corePurpose: { completed: Boolean, data: {} },
    vision: { completed: Boolean, data: {} },
    mission: { completed: Boolean, data: {} },
    brandPromise: { completed: Boolean, data: {} },
    coreValues: { completed: Boolean, data: {} },
    bhag: { completed: Boolean, data: {} },
    vividDescription: { completed: Boolean, data: {} },
    swotAnalysis: { completed: Boolean, data: {} },
    strategicPriorities: { completed: Boolean, data: {} },
    threeYearStrategy: { completed: Boolean, data: {} },
    smartGoals: { completed: Boolean, data: {} },
    quarterlyPlan: { completed: Boolean, data: {} },
    revenueModel: { completed: Boolean, data: {} },
    organizationalStructure: { completed: Boolean, data: {} },
    sopRoadmap: { completed: Boolean, data: {} },
    automationSystems: { completed: Boolean, data: {} },
    kpiDashboard: { completed: Boolean, data: {} },
    riskManagement: { completed: Boolean, data: {} },
    collaboration: { completed: Boolean, data: {} },
    strategySummary: { completed: Boolean, data: {} }
  },
  createdAt: Date,
  updatedAt: Date,
  archivedAt: Date
}
```

### MonthlyUpdates Collection
```javascript
{
  _id: ObjectId,
  visionBoardId: ObjectId (ref: VisionBoards),
  month: String,
  year: Number,
  actualRevenue: Number,
  actualTeamSize: Number,
  actualLeads: Number,
  notes: String,
  createdAt: Date
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/logout` | Logout user |

### Vision Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visionboards` | Get all user's vision boards |
| GET | `/api/visionboards/:id` | Get single vision board |
| POST | `/api/visionboards` | Create vision board |
| PUT | `/api/visionboards/:id` | Update vision board |
| DELETE | `/api/visionboards/:id` | Delete vision board |
| PUT | `/api/visionboards/:id/section/:sectionName` | Update section |
| GET | `/api/visionboards/:id/progress` | Get progress details |

### Strategy Sheet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visionboards/:id/strategy` | Get strategy sheet |
| PUT | `/api/visionboards/:id/strategy/:sectionName` | Update section |
| GET | `/api/visionboards/:id/strategy/progress` | Get strategy progress |
| GET | `/api/visionboards/:id/strategy/summary` | Get one-page summary |

### Progress & Updates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/:visionBoardId` | Get progress history |
| POST | `/api/progress/:visionBoardId/monthly` | Add monthly update |
| GET | `/api/progress/:visionBoardId/comparison` | Get actual vs target |
| GET | `/api/progress/:visionBoardId/ai-suggestions` | Get AI suggestions |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/suggestions` | Get AI suggestions |
| POST | `/api/ai/chat` | Chat with AI coach |
| POST | `/api/ai/analyze` | Analyze business data |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/analytics` | Get analytics |
| GET | `/api/admin/visionboards` | Get all vision boards |

---

## Project Structure

```
visionboard-pro/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # Login, Register, ProtectedRoute
│   │   │   ├── common/              # Button, Card, Modal, Input, Select, ProgressBar, Sidebar
│   │   │   ├── dashboard/           # Dashboard, MetricsCard, ProgressSummary
│   │   │   ├── visionboard/         # VisionBoardCreator, VisionBoardList, ExportOptions, VisualMode
│   │   │   ├── strategy/            # StrategySheetManager (20 sections)
│   │   │   ├── modules/             # TargetTracker, ResourceManager, ExecutionRiskManager
│   │   │   ├── financial-insights/  # FinancialInsights, FP&A Dashboard
│   │   │   ├── collaboration/       # CollaborationHub, Workspaces, Discussions
│   │   │   ├── progress/            # ProgressTracker, MonthlyUpdate, ComparisonChart
│   │   │   ├── admin/               # AdminDashboard, UserManagement, Analytics
│   │   │   └── settings/            # Settings (Theme, Profile, Notifications)
│   │   ├── context/                 # AuthContext, ThemeContext
│   │   ├── hooks/                   # useAuth, useVisionBoard
│   │   ├── services/                # api.js, authService.js, visionBoardService.js
│   │   ├── utils/                   # helpers.js, pdfGenerator.js, aiSuggestions.js
│   │   ├── pages/                   # Home, Dashboard, VisionBoards, VisionBoardDetail, etc.
│   │   └── App.jsx                  # Main app with routing
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Node.js Backend
│   ├── config/                      # db.js, jwt.js
│   ├── controllers/                 # authController, visionBoardController, strategySheetController
│   ├── middleware/                  # auth.js, adminAuth.js, errorHandling.js
│   ├── models/                      # User.js, VisionBoard.js, MonthlyUpdate.js
│   ├── routes/                      # auth.js, visionBoards.js, progress.js, admin.js, ai.js
│   ├── services/                    # aiService.js (OpenAI integration)
│   └── server.js                    # Express app entry point
│
└── package.json                     # Root scripts for dev/build
```

---

## Business Frameworks Implemented

| Framework | Description | Implementation |
|-----------|-------------|----------------|
| **Scaling Up (Rockefeller Habits)** | Strategic priorities, habits checklist, meeting rhythms | Strategic Priorities section, WWW Actions |
| **OKR Framework** | Objectives and Key Results tracking | SMART Goals section with OKR support |
| **SMART Goals** | Specific, Measurable, Achievable, Relevant, Time-bound | Goal setting module |
| **SWOT Analysis** | Strategic position assessment | Dedicated SWOT section |
| **BHAG Concept** | Big Hairy Audacious Goal (Jim Collins) | Vision section |
| **FACe/PACe Charts** | Functional/Process Accountability | Organizational Structure section |
| **9-Box Grid** | Talent assessment matrix | Talent Assessment in Resources |
| **CASh Strategies** | Cash acceleration methods | Financial Insights module |
| **One-Page Strategic Plan** | Summary view of entire strategy | Strategy Summary section |

---

## User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **User** | Create/edit/delete own vision boards, view progress, export PDFs, use AI features |
| **Admin** | All user permissions + manage all users, view platform analytics, deactivate users |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd visionboard-pro

# Install all dependencies (root, server, and client)
npm run install:all

# Or install manually
npm install
cd server && npm install
cd ../client && npm install
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run server   # Backend on port 5000
npm run client   # Frontend on port 5173
```

### Production

```bash
# Build frontend
npm run build

# Start production server
npm run start
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/visionboard-pro

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

### Backend (Render/Railway/Heroku)
1. Push to GitHub
2. Connect to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `client/dist` folder
3. Set `VITE_API_URL` to production backend URL

### MongoDB Atlas
1. Create MongoDB Atlas cluster
2. Whitelist server IPs
3. Update `MONGODB_URI` in production

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Built with React, Node.js, and MongoDB
- Styled with Tailwind CSS
- Business frameworks inspired by Scaling Up, Good to Great, and Traction
