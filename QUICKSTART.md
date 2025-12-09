# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start MongoDB
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Step 2: Start Backend
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5001
MongoDB connected
```

### Step 3: Start Frontend
Open a new terminal:
```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 16.0.5
- Local:        http://localhost:3000
```

### Step 4: Access the Application
1. Open your browser to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Enter an email and password
4. You'll be redirected to the Dashboard!

## 🎯 Try These Features

### 1. View Dashboard
- See overview statistics
- View charts and graphs
- Check recent activity

### 2. Add a Vulnerability
1. Click "Vulnerabilities" in the sidebar
2. Click "Add Vulnerability"
3. Fill in the form:
   - Name: "Example SQL Injection"
   - Target: "example.com"
   - Severity: "High"
   - Status: "Open"
   - Description: "SQL injection in login form"
4. Click "Create"

### 3. Run a Scan (Optional - requires tools)
1. Click "Scans" in the sidebar
2. Enter a target: `scanme.nmap.org`
3. Select scanner: Nmap
4. Click "Start Scan"

**Note**: This requires Nmap to be installed:
```bash
# Install Nmap
brew install nmap  # macOS
sudo apt-get install nmap  # Ubuntu/Debian
```

### 4. Generate a Report
1. Click "Reports" in the sidebar
2. Click "Generate Report"
3. Select vulnerabilities to include
4. Click "Generate Report"
5. Click "Download PDF" to get your report

### 5. Check Activity
1. Click "Activity" in the sidebar
2. View all your actions in chronological order

## 🔧 Troubleshooting

### Backend won't start
- **Error**: `EADDRINUSE`
  - Solution: Kill process on port 5001
  ```bash
  lsof -ti:5001 | xargs kill -9
  ```

- **Error**: MongoDB connection failed
  - Solution: Make sure MongoDB is running
  ```bash
  mongosh  # Should connect successfully
  ```

### Frontend won't start
- **Error**: Port 3000 already in use
  - Solution: Use different port
  ```bash
  PORT=3001 npm run dev
  ```

### API calls failing
- Check that backend is running on port 5001
- Check `.env.local` in frontend has correct API URL
- Check browser console for CORS errors

### Can't login after signup
- Check backend logs for errors
- Make sure MongoDB is running
- Try clearing browser localStorage and cookies

## 📝 Default Test Account

Create your own account via the signup page. There are no default credentials.

## 🎨 Customization

### Change API Port (Backend)
Edit `backend/.env`:
```env
PORT=5002  # Change from 5001 to 5002
```

Then update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```

### Change MongoDB Database Name
Edit `backend/.env`:
```env
MONGO_URI=mongodb://username:password@127.0.0.1:27017/MyCustomDB?authSource=admin
```

## ⚡ Production Tips

### Backend
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start src/server.js --name vulnreaper-api
pm2 save
pm2 startup
```

### Frontend
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🆘 Need Help?

1. Check the main [README.md](./README.md) for detailed documentation
2. Review the API endpoints section
3. Check browser console for errors
4. Check backend terminal for error logs

## 🎉 You're All Set!

Your Vulnerability Management System is now ready to use. Start scanning, managing vulnerabilities, and generating reports!
