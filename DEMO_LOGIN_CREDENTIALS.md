# 🔐 Demo Login Credentials - HGM Admin Panel

## 📋 **Available Demo Accounts**

### **👑 Admin Accounts:**
```
Username: admin
Password: admin123
Role: Administrator
Access: Full system access

Username: test  
Password: test123
Role: Test Administrator
Access: Full system access

Username: hgm
Password: hgm2024
Role: HGM Administrator  
Access: Full system access
```

### **👥 Supervisor Accounts:**
```
Username: supervisor
Password: super123
Role: Supervisor
Access: Limited admin access

Username: raipur
Password: raipur123
Role: Raipur Supervisor
Access: Regional supervision
```

### **👤 User Account:**
```
Username: demo
Password: demo123
Role: User
Access: Basic user access
```

## 🚀 **How to Login:**

1. **Go to login page**: `http://localhost:3000`
2. **Enter credentials**: Use any of the above username/password combinations
3. **Click login**: You'll be redirected to dashboard
4. **Test backend**: Click "Test Backend Connection" button first (optional)

## 🔧 **Login Flow:**

1. **Backend First**: App tries your real backend API
2. **Demo Fallback**: If backend fails, uses demo credentials
3. **Success**: Stores user data and navigates to dashboard

## 📱 **Quick Test:**

**Try this for quick access:**
- Username: `admin`
- Password: `admin123`

**Or this for supervisor access:**
- Username: `supervisor` 
- Password: `super123`

## ⚠️ **Notes:**

- **Registration removed**: No new user registration option
- **Demo only**: These credentials work in demo mode
- **Backend ready**: Real backend integration available
- **Fallback system**: Always works even if backend is down

## 🎯 **Recommended for Testing:**

**Admin Access**: `admin / admin123`
**Supervisor Access**: `supervisor / super123`
**Basic User**: `demo / demo123`

**Happy Testing! 🎉**
