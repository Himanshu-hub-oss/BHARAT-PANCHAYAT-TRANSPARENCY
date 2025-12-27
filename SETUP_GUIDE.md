# Setup Guide for Different Laptops

This guide will help you run the Bharat Panchayat Transparency app on any Windows laptop.

## Prerequisites

Before running `StartApp.bat`, ensure the following software is installed:

### 1. **Python 3.8 or Higher**
- Download from: https://www.python.org/downloads/
- **IMPORTANT**: During installation, check "Add Python to PATH"
- Verify installation:
  ```bash
  python --version
  ```

### 2. **Node.js (includes npm)**
- Download from: https://nodejs.org/ (LTS version recommended)
- **IMPORTANT**: This automatically installs npm
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

## Quick Start

### Option 1: Automatic Setup (Recommended)
1. Double-click `StartApp.bat`
2. The script will automatically:
   - Check if Python and Node.js are installed
   - Create virtual environment if needed
   - Install all dependencies
   - Start both backend and frontend servers
   - Open the app in your browser

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm start
```

## Common Issues and Solutions

### Issue 1: "Python is not recognized"
**Solution**: Python is not installed or not in PATH
- Reinstall Python and check "Add Python to PATH"
- Or manually add Python to system PATH

### Issue 2: "Node is not recognized"
**Solution**: Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

### Issue 3: "Port already in use"
**Solution**: Another application is using port 8000 or 3000
- Close other applications using these ports
- Or modify the ports in:
  - Backend: `StartApp.bat` line with `--port 8000`
  - Frontend: Create `.env` file with `PORT=3001`

### Issue 4: "Module not found" errors
**Solution**: Dependencies not installed
- Backend: Run `pip install -r requirements.txt` in backend folder
- Frontend: Run `npm install` in frontend folder

### Issue 5: Virtual environment activation fails
**Solution**: 
- Delete the `backend\venv` folder
- Run `StartApp.bat` again to recreate it

### Issue 6: Frontend doesn't start
**Solution**:
- Delete `frontend\node_modules` folder
- Delete `frontend\package-lock.json`
- Run `npm install` again in frontend folder

## File Structure
```
BHARAT PANCHAYAT TRANSPARENCY/
├── backend/
│   ├── venv/              (auto-created)
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── node_modules/      (auto-created)
│   ├── package.json
│   ├── src/
│   └── ...
├── StartApp.bat           (run this!)
└── SETUP_GUIDE.md         (this file)
```

## First-Time Setup Checklist

- [ ] Install Python 3.8+ (with PATH option checked)
- [ ] Install Node.js LTS (includes npm)
- [ ] Download/Copy the entire project folder
- [ ] Run `StartApp.bat`
- [ ] Wait for automatic setup to complete
- [ ] Browser should open automatically to http://localhost:3000

## Access Points

After successful startup:
- **Frontend (UI)**: http://localhost:3000
- **Backend (API)**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API Alternative Docs**: http://localhost:8000/redoc

## Stopping the Application

1. Close the browser
2. In each terminal window (Backend Server & Frontend Server):
   - Press `Ctrl + C`
   - Type `Y` when asked to terminate
3. Or simply close both terminal windows

## Transferring to Another Laptop

### What to Copy:
- ✅ Entire project folder
- ✅ All source code files

### What NOT to Copy (will be auto-created):
- ❌ `backend\venv\` folder
- ❌ `frontend\node_modules\` folder
- ❌ `backend\__pycache__\` folders
- ❌ `.pyc` files

### Recommended: Create a ZIP without dependencies
```bash
# Exclude these folders when creating ZIP:
- backend/venv/
- frontend/node_modules/
- **/__pycache__/
- **/*.pyc
```

## Need Help?

If you encounter issues:
1. Check the error message in the terminal
2. Refer to "Common Issues" section above
3. Ensure Python and Node.js are properly installed
4. Try manual setup (Option 2) to see detailed error messages

## System Requirements

- **OS**: Windows 10 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB free space (for dependencies)
- **Internet**: Required for first-time dependency installation
