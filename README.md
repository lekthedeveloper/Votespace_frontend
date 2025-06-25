# VoteSpace 🗳️

**Everything you need to make great decisions**

VoteSpace is a powerful React-based decision-making platform that streamlines collaborative voting and team decision processes. With secure and anonymous voting capabilities, VoteSpace brings teams together to make important decisions with confidence and transparency.

## ✨ Features

### 🔒 Smart Voting System
- Secure and anonymous voting for all participants
- Real-time results with live updates
- Fair and transparent decision-making process

### 👥 Team Collaboration
- Unlimited team members
- Seamless communication tools
- Transparent decision-making process

### 📊 Real-time Analytics
- Live result tracking
- Comprehensive voting analytics
- Data-driven insights

## 🚀 Quick Start

### Simple 4-Step Process

1. **Create Your Decision Room** - Set up your question, add options, and configure voting settings
2. **Invite Your Team** - Share a secure link with team members or stakeholders
3. **Collect Anonymous Votes** - Team members vote privately for honest feedback
4. **View Real-time Results** - Watch results update live and make informed decisions

## 🏗️ Project Structure

```
VOTESPACE/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout/        # Layout components (Header, Footer, etc.)
│   │   ├── ProtectedRoute/ # Route protection components
│   │   └── security/      # Security-related components
│   ├── contexts/          # React Context providers
│   │   └── AuthContext    # Authentication context
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── HomePage       # Landing page
│   │   ├── DashboardPage  # User dashboard
│   │   ├── CreateRoomPage # Room creation
│   │   └── RoomDetailsPage# Voting room details
│   ├── security/          # Security utilities and providers
│   ├── services/          # API services and external integrations
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── netlify.toml           # Netlify deployment configuration
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Security**: Custom security providers and input sanitization
- **Deployment**: Netlify (Frontend) / Render (Backend)

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-frontend-repo-url>
cd votespace
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=VoteSpace
REACT_APP_ENCRYPTION_KEY=your-secure-encryption-key-here
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
# or
yarn build
```

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 📦 Backend Setup

The backend API is available at: [https://github.com/lekthedeveloper/votingspace.git](https://github.com/lekthedeveloper/votingspace.git)

### Backend Deployment on Render

1. Fork or clone the backend repository
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Follow the deployment instructions in the backend repository
5. Update your frontend `.env` file with the deployed backend URL

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. **Automatic Deployment** (Recommended):
   - Connect your GitHub repository to Netlify
   - Netlify will automatically deploy on every push to main branch

2. **Manual Deployment**:
   ```bash
   npm run build
   # Upload the 'dist' folder to Netlify
   ```

### Environment Variables for Production

Set these environment variables in your deployment platform:

- `VITE_API_URL`: Your backend API URL
- `REACT_APP_ENCRYPTION_KEY`: Secure encryption key for data protection

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔐 Security Features

- **Input Sanitization**: XSS prevention and input validation
- **Rate Limiting**: Protection against brute force attacks
- **Session Management**: Secure session handling with automatic timeout
- **Content Security Policy**: CSP headers for additional security
- **Encrypted Storage**: Secure local storage for sensitive data
- **Device Fingerprinting**: Additional security layer for user sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Contact the development team

## 🚀 Coming Soon Features

### 💬 Discussion Threads
Integrate a discussion forum or comment section within each decision room, allowing participants to discuss options before or during the voting process. This feature will enable:
- Real-time discussions within voting rooms
- Anonymous or identified commenting options
- Threaded conversations for better organization
- Moderation tools for room creators

### 📝 Vote Justification
Provide an option for users to anonymously justify their vote, adding a qualitative layer to the decision-making process. Features include:
- Optional anonymous reasoning for each vote
- Rich text support for detailed explanations
- Aggregated insights from vote justifications
- Export capabilities for comprehensive decision reports

### 🔮 Additional Planned Features
- [ ] Two-Factor Authentication
- [ ] Enhanced Analytics Dashboard
- [ ] Integration with Popular Tools (Slack, Teams, etc.)
- [ ] Multi-language Support
- [ ] Email Notifications
- [ ] Export Results to PDF/CSV

---

