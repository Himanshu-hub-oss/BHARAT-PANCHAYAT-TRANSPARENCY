# Quick Reference - Deployment Checklist

## For the Person Setting Up on a New Laptop

### Step 1: Install Required Software
- [ ] **Python 3.8+** from https://www.python.org/
  - ⚠️ Check "Add Python to PATH" during installation
- [ ] **Node.js LTS** from https://nodejs.org/
  - Includes npm automatically

### Step 2: Get the Project Files
- [ ] Copy the entire project folder to the new laptop
- [ ] **DO NOT copy** these folders (they'll be auto-created):
  - `backend\venv\`
  - `frontend\node_modules\`

### Step 3: Run the App
- [ ] Double-click `StartApp.bat`
- [ ] Wait for automatic setup (first time takes 2-5 minutes)
- [ ] Browser will open automatically

### Step 4: Verify
- [ ] Frontend opens at http://localhost:3000
- [ ] Backend API docs at http://localhost:8000/docs
- [ ] Both terminal windows show no errors

---

## What the New StartApp.bat Does Automatically

✅ Checks if Python is installed  
✅ Checks if Node.js is installed  
✅ Creates virtual environment (if missing)  
✅ Installs Python dependencies (if missing)  
✅ Installs Node.js dependencies (if missing)  
✅ Starts backend server  
✅ Starts frontend server  
✅ Opens browser automatically  

---

## If Something Goes Wrong

### Error: "Python is not recognized"
→ Install Python and add to PATH

### Error: "Node is not recognized"  
→ Install Node.js

### Error: "Port already in use"
→ Close other apps using ports 8000 or 3000

### Error: Dependencies fail to install
→ Check internet connection
→ Run as Administrator

---

## Manual Commands (If Needed)

### Backend Only:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Only:
```bash
cd frontend
npm install
npm start
```

---

## Key Differences from Old Version

| Old StartApp.bat | New StartApp.bat |
|-----------------|------------------|
| ❌ No dependency checks | ✅ Checks Python & Node.js |
| ❌ Assumes venv exists | ✅ Creates venv if missing |
| ❌ Assumes packages installed | ✅ Auto-installs packages |
| ❌ Silent failures | ✅ Clear error messages |
| ❌ No setup guidance | ✅ Helpful error messages |

---

## Contact/Support

If issues persist:
1. Read `SETUP_GUIDE.md` for detailed troubleshooting
2. Check terminal windows for specific error messages
3. Verify Python and Node.js versions match requirements
