# HGM Admin Panel - Backend API Documentation

## API Key और Configuration

### Demo API Key
```
API Key: demo-hgm-api-key-2024-raipur
Base URL: http://localhost:3001/api
```

### Headers Required
```
Content-Type: application/json
Accept: application/json
X-API-Key: demo-hgm-api-key-2024-raipur
Authorization: Bearer <your-jwt-token> (for protected routes)
X-API-Version: 1.0
```

## Authentication Endpoints

### 1. Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "Admin Raipur",
      "role": "admin",
      "permissions": ["dashboard.view", "families.create", ...]
    }
  }
}
```

### 2. Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Headers**: Authorization required
- **Response**:
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### 3. Refresh Token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Headers**: Authorization required
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token"
  }
}
```

## Dashboard Endpoints

### 1. Get Dashboard Stats
- **URL**: `/dashboard/stats`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalAnganwadi": 156,
    "totalFamilies": 2847,
    "totalPlants": 28470,
    "activePlants": 25623,
    "monthlyGrowth": {
      "anganwadi": 12,
      "families": 8,
      "plants": 15,
      "activePlants": 5
    }
  }
}
```

### 2. Get Recent Activities
- **URL**: `/dashboard/activities`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "plant",
      "title": "राम कुमार को पौधा वितरित",
      "meta": "आज, 2:30 PM",
      "status": "success",
      "timestamp": "2024-01-20T14:30:00Z"
    }
  ]
}
```

## Plant Management Endpoints

### 1. Get All Plants
- **URL**: `/plants?page=1&limit=10&search=&anganwadiCenter=&status=`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "plants": [
      {
        "id": 1,
        "plantId": "HGM001",
        "varietyName": "मुंगा एडी 1",
        "familyName": "राम कुमार",
        "familyId": "FAM001",
        "anganwadiCenter": "केंद्र 1",
        "distributionDate": "2024-01-15",
        "currentStatus": "स्वस्थ",
        "lastPhotoDate": "2024-01-20",
        "careScore": 85
      }
    ],
    "totalCount": 150,
    "currentPage": 1,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 2. Get Plant by ID
- **URL**: `/plants/:id`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "plantId": "HGM001",
    "varietyName": "मुंगा एडी 1",
    "familyName": "राम कुमार",
    "familyId": "FAM001",
    "anganwadiCenter": "केंद्र 1",
    "distributionDate": "2024-01-15",
    "currentStatus": "स्वस्थ",
    "lastPhotoDate": "2024-01-20",
    "careScore": 85,
    "photos": [
      {
        "id": 1,
        "url": "/images/plant1.jpg",
        "uploadDate": "2024-01-20",
        "description": "पौधे की वर्तमान स्थिति"
      }
    ],
    "careHistory": [
      {
        "date": "2024-01-20",
        "action": "फोटो अपलोड",
        "status": "पूर्ण"
      }
    ]
  }
}
```

### 3. Add New Plant
- **URL**: `/plants`
- **Method**: `POST`
- **Body**:
```json
{
  "varietyName": "मुंगा एडी 1",
  "familyId": "FAM001",
  "anganwadiCenter": "केंद्र 1",
  "distributionDate": "2024-01-15",
  "initialStatus": "नया"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "plantId": "HGM001",
    "message": "पौधा सफलतापूर्वक जोड़ा गया"
  }
}
```

### 4. Update Plant
- **URL**: `/plants/:id`
- **Method**: `PUT`
- **Body**:
```json
{
  "currentStatus": "स्वस्थ",
  "careScore": 90,
  "notes": "पौधे की अच्छी देखभाल हो रही है"
}
```

### 5. Delete Plant
- **URL**: `/plants/:id`
- **Method**: `DELETE`
- **Response**:
```json
{
  "success": true,
  "message": "पौधा सफलतापूर्वक हटाया गया"
}
```

### 6. Upload Plant Photo
- **URL**: `/plants/:id/photos`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with file and description
- **Response**:
```json
{
  "success": true,
  "data": {
    "photoId": 1,
    "url": "/images/plant1.jpg",
    "message": "फोटो सफलतापूर्वक अपलोड हुई"
  }
}
```

## Family Management Endpoints

### 1. Get All Families
- **URL**: `/families?page=1&limit=10&search=&anganwadiCenter=&status=`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "families": [
      {
        "id": 1,
        "familyId": "FAM001",
        "headOfFamily": "राम कुमार",
        "contactNumber": "9876543210",
        "address": "ग्राम पंचायत रायपुर, वार्ड 1",
        "anganwadiCenter": "केंद्र 1",
        "registrationDate": "2024-01-15",
        "totalMembers": 5,
        "plantsAssigned": 2,
        "status": "सक्रिय",
        "lastUpdate": "2024-01-20"
      }
    ],
    "totalCount": 200,
    "currentPage": 1,
    "totalPages": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 2. Add New Family
- **URL**: `/families`
- **Method**: `POST`
- **Body**:
```json
{
  "headOfFamily": "नया परिवार मुखिया",
  "contactNumber": "9876543210",
  "address": "पूरा पता",
  "anganwadiCenter": "केंद्र 1",
  "totalMembers": 4,
  "members": [
    {
      "name": "सदस्य नाम",
      "relation": "रिश्ता",
      "age": 30,
      "gender": "पुरुष/महिला",
      "aadharNumber": "1234-5678-9012"
    }
  ]
}
```

## Anganwadi Center Endpoints

### 1. Get All Centers
- **URL**: `/anganwadi?page=1&limit=10&search=&ward=&status=`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "centers": [
      {
        "id": 1,
        "centerId": "AWC001",
        "centerName": "आंगनबाड़ी केंद्र 1",
        "supervisorName": "प्रिया शर्मा",
        "contactNumber": "9876543220",
        "address": "ग्राम पंचायत रायपुर, मुख्य मार्ग",
        "ward": "वार्ड 1",
        "totalFamilies": 45,
        "activeFamilies": 42,
        "totalPlants": 156,
        "healthyPlants": 142,
        "establishmentDate": "2020-01-15",
        "status": "सक्रिय",
        "lastInspection": "2024-01-20"
      }
    ],
    "totalCount": 50,
    "currentPage": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Analytics Endpoints

### 1. Get Analytics Data
- **URL**: `/analytics?dateRange=month&anganwadiCenter=&plantVariety=`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalFamilies": 2847,
      "totalPlants": 28470,
      "activePlants": 25623,
      "totalAnganwadi": 156,
      "plantSurvivalRate": 90.1,
      "familyParticipationRate": 94.3
    },
    "trends": {
      "familyRegistration": [
        {"month": "Jan", "count": 234},
        {"month": "Feb", "count": 267}
      ],
      "plantDistribution": [
        {"month": "Jan", "count": 2340},
        {"month": "Feb", "count": 2670}
      ]
    },
    "plantVarieties": [
      {"name": "मुंगा एडी 1", "count": 8500, "percentage": 30},
      {"name": "मुंगा एडी 2", "count": 7100, "percentage": 25}
    ]
  }
}
```

### 2. Generate Report
- **URL**: `/reports`
- **Method**: `POST`
- **Body**:
```json
{
  "reportType": "family-summary",
  "parameters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "anganwadiCenter": "केंद्र 1",
    "format": "csv"
  }
}
```

### 3. Export Data
- **URL**: `/export`
- **Method**: `POST`
- **Body**:
```json
{
  "exportType": "plants",
  "filters": {
    "status": "स्वस्थ",
    "anganwadiCenter": "केंद्र 1"
  },
  "format": "csv"
}
```

## File Upload Endpoints

### 1. Upload Photo
- **URL**: `/upload/photo`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with file, type, and entityId
- **Response**:
```json
{
  "success": true,
  "data": {
    "fileId": "file-id",
    "url": "/uploads/photos/filename.jpg",
    "filename": "filename.jpg",
    "size": 1024000,
    "uploadDate": "2024-01-20T10:30:00Z"
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message in Hindi",
  "code": "ERROR_CODE",
  "details": "Additional error details if available"
}
```

### Common Error Codes
- `INVALID_CREDENTIALS`: Invalid login credentials
- `TOKEN_EXPIRED`: JWT token has expired
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required permissions
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Requested resource not found
- `DUPLICATE_ENTRY`: Duplicate data entry attempted
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `INVALID_FILE_TYPE`: File type not allowed

## Demo Users

### Admin User
- Username: `admin`
- Password: `admin123`
- Role: `admin`
- Permissions: All operations

### Supervisor User
- Username: `supervisor`
- Password: `super123`
- Role: `supervisor`
- Permissions: Limited admin operations

### Demo User
- Username: `demo`
- Password: `demo123`
- Role: `user`
- Permissions: Read-only access

## Backend Implementation Notes

1. **Database**: MySQL/PostgreSQL recommended
2. **Authentication**: JWT tokens with 24-hour expiration
3. **File Storage**: Local file system or cloud storage (AWS S3, etc.)
4. **Validation**: Server-side validation for all inputs
5. **Security**: API rate limiting, CORS configuration
6. **Logging**: Comprehensive request/response logging
7. **Backup**: Regular database backups
8. **Performance**: Database indexing, query optimization

## Frontend Integration

सभी API services आपके frontend में `src/services/` folder में ready हैं:
- `authService.js` - Authentication
- `dashboardService.js` - Dashboard data
- `plantService.js` - Plant management
- `familyService.js` - Family management
- `anganwadiService.js` - Anganwadi centers
- `analyticsService.js` - Analytics and reports

API hooks भी available हैं `src/hooks/useApi.js` में React components के लिए।
