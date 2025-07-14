# हर घर मुंगा योजना - Admin Panel

## Project Overview

यह **हर घर मुंगा योजना** का Admin Panel है जो Chhattisgarh Government के लिए बनाया गया है। इस system के द्वारा:

- पौधा प्रबंधन (Plant Management)
- परिवार प्रबंधन (Family Management) 
- आंगनबाड़ी केंद्र प्रबंधन (Anganwadi Center Management)
- Analytics और Reports
- Dashboard और Real-time monitoring

## 🚀 Features

### ✅ Completed Features

1. **Authentication System**
   - JWT based authentication
   - Role-based access control
   - Demo login credentials

2. **Dashboard**
   - Real-time statistics
   - Recent activities
   - Quick actions
   - Responsive design

3. **Plant Management**
   - Add/Edit/Delete plants
   - Photo upload functionality
   - Plant status tracking
   - Care history

4. **Family Management**
   - Family registration
   - Member management
   - Plant assignment
   - Search and filters

5. **Anganwadi Centers**
   - Center management
   - Performance tracking
   - Family assignments

6. **Analytics & Reports**
   - Data visualization
   - Export functionality
   - Trend analysis

7. **API Integration**
   - Complete API service layer
   - Mock data for demo
   - Error handling
   - Loading states

### 🔄 Bilingual Support
- Hindi (हिंदी) - Primary
- English - Secondary

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **Styling**: Styled Components + Material-UI Icons
- **Routing**: React Router DOM
- **Charts**: Chart.js + React Chart.js 2
- **API**: Custom API service layer with hooks
- **State Management**: React hooks
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd my-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env.local

# Edit environment variables
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_KEY=demo-hgm-api-key-2024-raipur
```

### 4. Start Development Server
```bash
npm start
```

Application will open at: `http://localhost:3000`

## 🔐 Demo Login Credentials

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator (Full Access)

### Supervisor User
- **Username**: `supervisor`
- **Password**: `super123`
- **Role**: Supervisor (Limited Access)

### Demo User
- **Username**: `demo`
- **Password**: `demo123`
- **Role**: User (Read-only)

## 🗂️ Project Structure

```
my-website/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── PlantManagement.js
│   │   ├── FamilyManagement.js
│   │   ├── AnganwadiCenter.js
│   │   └── Analytics.js
│   ├── services/
│   │   ├── apiService.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── plantService.js
│   │   ├── familyService.js
│   │   ├── anganwadiService.js
│   │   ├── analyticsService.js
│   │   └── index.js
│   ├── hooks/
│   │   └── useApi.js
│   ├── config/
│   │   └── api.js
│   ├── utils/
│   │   └── apiUtils.js
│   ├── App.js
│   ├── index.js
│   └── App.css
├── API_Documentation.md
├── package.json
└── README.md
```

## 🔌 API Integration

### Demo API Key
```
API Key: demo-hgm-api-key-2024-raipur
Base URL: http://localhost:3001/api
```

### Available Services
- **authService**: Authentication operations
- **dashboardService**: Dashboard data
- **plantService**: Plant management
- **familyService**: Family management
- **anganwadiService**: Anganwadi centers
- **analyticsService**: Analytics and reports

### API Hooks
- **useAuth**: Authentication state
- **useDashboardData**: Dashboard statistics
- **usePlants**: Plant management with CRUD
- **useFamilies**: Family management with CRUD
- **useAnganwadiCenters**: Center data
- **useAnalytics**: Analytics data

## 📊 Mock Data

Currently working with demo/mock data:
- 156 Anganwadi Centers
- 2,847 Families
- 28,470 Plants distributed
- 25,623 Active plants

## 🎯 Backend Integration

### Required Endpoints
See `API_Documentation.md` for complete API specification.

### Authentication
- JWT tokens with 24-hour expiration
- Role-based permissions
- Refresh token mechanism

### Database Schema
Recommended tables:
- users
- anganwadi_centers
- families
- family_members
- plants
- plant_photos
- activities
- reports

## Available Scripts

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **Server Deployment**: Apache, Nginx
3. **Cloud Deployment**: AWS S3, Azure, GCP

### Environment Variables for Production
```bash
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_API_KEY=your-production-api-key
REACT_APP_DEBUG_MODE=false
REACT_APP_MOCK_API=false
```

## 📞 Support & Contact

For technical support or queries:
- **Email**: support@hgm-admin.gov.in
- **Documentation**: API_Documentation.md

## 📄 License

This project is licensed under the Government of Chhattisgarh - All rights reserved.

---

**Developed with ❤️ for Chhattisgarh Government**
**हर घर मुंगा योजना - पोषण के लिए एक कदम आगे**

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
