# 🔒 Security Configuration Guide

This project uses environment variables for sensitive configuration to ensure security.

## ⚠️ Required Environment Variables

### Database Configuration
```env
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
```

### JWT Configuration
```env
JWT_SECRET=your_jwt_secret_base64_encoded
```

### Email Configuration (Gmail SMTP)
```env
GMAIL_USERNAME=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

### Frontend Configuration
```env
FRONTEND_URL=http://localhost:4200
```

## 🛠️ Development Setup

### Option 1: IDE Environment Variables
Set these in your IDE run configuration:
- IntelliJ IDEA: Run > Edit Configurations > Environment Variables
- VS Code: Use launch.json or .env file

### Option 2: System Environment Variables
```bash
# Windows (PowerShell)
$env:DB_PASSWORD="deniz"
$env:JWT_SECRET="ZGV2ZWxvcG1lbnRTZWNyZXRLZXlGb3JEZXZlbG9wbWVudE9ubHlOb3RGb3JQcm9kdWN0aW9u"
$env:GMAIL_USERNAME="neredengeliyore@gmail.com"
$env:GMAIL_APP_PASSWORD="xvaz xkwo hidn gggz"

# Linux/Mac (Bash)
export DB_PASSWORD="deniz"
export JWT_SECRET="ZGV2ZWxvcG1lbnRTZWNyZXRLZXlGb3JEZXZlbG9wbWVudE9ubHlOb3RGb3JQcm9kdWN0aW9u"
export GMAIL_USERNAME="neredengeliyore@gmail.com"
export GMAIL_APP_PASSWORD="xvaz xkwo hidn gggz"
```

## 📧 Gmail App Password Setup

1. Enable 2-Factor Authentication on Gmail
2. Go to: Google Account > Security > App passwords
3. Generate app password for "Mail"
4. Use the generated password (not your Gmail password!)

## 🚀 Production Deployment

For production, set environment variables in your deployment platform:
- **Heroku**: Config Vars
- **AWS**: Environment Variables in Elastic Beanstalk/ECS
- **Docker**: Environment variables in docker-compose.yml
- **Kubernetes**: ConfigMaps and Secrets

## ⚡ Quick Development Start

```bash
# Set environment variables for development
export DB_PASSWORD="deniz"
export JWT_SECRET="ZGV2ZWxvcG1lbnRTZWNyZXRLZXlGb3JEZXZlbG9wbWVudE9ubHlOb3RGb3JQcm9kdWN0aW9u"
export GMAIL_USERNAME="neredengeliyore@gmail.com"
export GMAIL_APP_PASSWORD="xvaz xkwo hidn gggz"
export FRONTEND_URL="http://localhost:4200"

# Start backend
cd backend/program-tracker
./mvnw spring-boot:run

# Start frontend
cd frontend/fitness-front
npm start
```

## 🔐 Security Notes

- **Never commit actual secrets to git**
- **Use different secrets for production**
- **Regularly rotate credentials**
- **Use strong, unique JWT secrets**
- **Enable 2FA on all accounts** 