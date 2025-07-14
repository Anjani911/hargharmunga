# Backend Development Guide - हर घर मुंगा योजना

## 🚀 Frontend Ready - Ab Backend Banao!

Aapka complete frontend API integration ke saath ready hai. Ab backend development karna hai.

## 📋 Backend Requirements

### **Technology Stack Options:**

#### Option 1: Node.js + Express
```bash
# Create backend project
mkdir hgm-backend
cd hgm-backend
npm init -y
npm install express cors helmet morgan dotenv
npm install jsonwebtoken bcryptjs multer
npm install mysql2 # or mongoose for MongoDB
```

#### Option 2: Python + FastAPI
```bash
# Create backend project
mkdir hgm-backend
cd hgm-backend
pip install fastapi uvicorn sqlalchemy pymysql
pip install python-jose python-multipart
```

#### Option 3: PHP + Laravel
```bash
# Create backend project
composer create-project laravel/laravel hgm-backend
cd hgm-backend
composer install
```

## 🗄️ Database Schema

### **Required Tables:**

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'supervisor', 'user') DEFAULT 'user',
    email VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Anganwadi Centers table
CREATE TABLE anganwadi_centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    center_id VARCHAR(20) UNIQUE NOT NULL,
    center_name VARCHAR(100) NOT NULL,
    supervisor_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    address TEXT,
    ward VARCHAR(50),
    establishment_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_inspection DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Families table
CREATE TABLE families (
    id INT PRIMARY KEY AUTO_INCREMENT,
    family_id VARCHAR(20) UNIQUE NOT NULL,
    head_of_family VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    address TEXT,
    anganwadi_center_id INT,
    total_members INT DEFAULT 1,
    registration_date DATE,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (anganwadi_center_id) REFERENCES anganwadi_centers(id)
);

-- Family Members table
CREATE TABLE family_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT,
    name VARCHAR(100) NOT NULL,
    relation VARCHAR(50),
    age INT,
    gender ENUM('male', 'female', 'other'),
    aadhar_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

-- Plants table
CREATE TABLE plants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plant_id VARCHAR(20) UNIQUE NOT NULL,
    variety_name VARCHAR(100) NOT NULL,
    family_id INT,
    anganwadi_center_id INT,
    distribution_date DATE,
    current_status ENUM('healthy', 'needs_care', 'sick', 'harvested') DEFAULT 'healthy',
    care_score INT DEFAULT 0,
    last_photo_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (anganwadi_center_id) REFERENCES anganwadi_centers(id)
);

-- Plant Photos table
CREATE TABLE plant_photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plant_id INT,
    photo_url VARCHAR(255) NOT NULL,
    description TEXT,
    upload_date DATE,
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

-- Activities table (for dashboard)
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('plant', 'family', 'photo', 'harvest') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    entity_id INT, -- plant_id or family_id
    user_id INT,
    status ENUM('success', 'pending', 'failed') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔗 Required API Endpoints

### **Authentication:**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### **Dashboard:**
```
GET /api/dashboard/stats
GET /api/dashboard/activities
```

### **Plants:**
```
GET /api/plants?page=1&limit=10&search=&status=
POST /api/plants
GET /api/plants/:id
PUT /api/plants/:id
DELETE /api/plants/:id
POST /api/plants/:id/photos
```

### **Families:**
```
GET /api/families?page=1&limit=10&search=&center=
POST /api/families
GET /api/families/:id
PUT /api/families/:id
DELETE /api/families/:id
GET /api/families/:id/members
POST /api/families/:id/members
```

### **Anganwadi Centers:**
```
GET /api/anganwadi?page=1&limit=10&search=&ward=
POST /api/anganwadi
GET /api/anganwadi/:id
PUT /api/anganwadi/:id
GET /api/anganwadi/:id/families
```

### **Analytics:**
```
GET /api/analytics?dateRange=month&center=&variety=
POST /api/reports
POST /api/export
```

### **File Upload:**
```
POST /api/upload/photo
POST /api/upload/document
```

## 🔧 Sample Backend Code (Node.js + Express)

### **app.js:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/families', require('./routes/families'));
app.use('/api/anganwadi', require('./routes/anganwadi'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### **routes/auth.js:**
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check user in database
    // const user = await User.findOne({ username });
    
    // For demo - hardcoded check
    const demoUsers = {
      'admin': { id: 1, name: 'Admin Raipur', role: 'admin', password: 'admin123' },
      'supervisor': { id: 2, name: 'Supervisor Demo', role: 'supervisor', password: 'super123' }
    };
    
    const user = demoUsers[username];
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'hgm-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

## 🚀 Deployment Steps

### **1. Development Setup:**
```bash
# Backend setup
cd hgm-backend
npm install
npm run dev

# Frontend update (environment)
# .env.local file mein:
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_MOCK_API=false
```

### **2. Production Deployment:**
```bash
# Backend: Deploy to VPS/Cloud
# Database: Setup MySQL/PostgreSQL
# Frontend: Build and deploy
npm run build
```

## 📞 Support

Complete API documentation: `API_Documentation.md`
Frontend integration: All services ready in `src/services/`

**Next: Backend development karo aur real API endpoints implement karo!** 🚀
