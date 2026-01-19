# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with Google, GitHub, or email
4. Verify your email if required

### Step 2: Create a Free Cluster
1. After logging in, you'll see **"Create a deployment"**
2. Choose **"M0 FREE"** (Free tier - perfect for development)
3. Select a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to you (e.g., `us-east-1`)
5. Click **"Create Deployment"**
6. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User
1. You'll see a **"Create Database User"** screen
2. Choose **"Username and Password"** authentication
3. Enter:
   - **Username**: `socialup` (or your choice)
   - **Password**: Generate a strong password (click "Autogenerate Secure Password" or create your own)
   - ⚠️ **SAVE THE PASSWORD** - you won't see it again!
4. Click **"Create Database User"**

### Step 4: Configure Network Access
1. Click **"Add My Current IP Address"** (allows your computer to connect)
2. Or click **"Allow Access from Anywhere"** (0.0.0.0/0) - less secure but easier for development
3. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as driver
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<username>` with your database username (e.g., `socialup`)
6. **Replace** `<password>` with your database password
7. **Add database name** before the `?` - change it to:
   ```
   mongodb+srv://socialup:YourPassword@cluster0.xxxxx.mongodb.net/socialup?retryWrites=true&w=majority
   ```

### Step 6: Add to Your Project
1. Create `server/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://socialup:YourPassword@cluster0.xxxxx.mongodb.net/socialup?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3001
   ```
2. Replace `YourPassword` with your actual password
3. Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### Step 7: Test Connection
```bash
cd server
npm run server
```

You should see: `MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net`

---

## Option 2: Local MongoDB Installation

### macOS Installation

#### Using Homebrew (Easiest)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0
```

#### Manual Installation
1. Download MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Select:
   - **Version**: 7.0 (or latest)
   - **Platform**: macOS
   - **Package**: TGZ
3. Extract and follow installation instructions

### Windows Installation
1. Download MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Select:
   - **Version**: 7.0 (or latest)
   - **Platform**: Windows
   - **Package**: MSI
3. Run installer:
   - Choose **"Complete"** installation
   - Check **"Install MongoDB as a Service"**
   - Choose **"Run service as Network Service user"**
   - Install MongoDB Compass (GUI tool) - optional but helpful

### Linux Installation (Ubuntu/Debian)
```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Configure Local MongoDB Connection
1. Create `server/.env` file:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/socialup
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3001
   ```

2. Verify MongoDB is running:
   ```bash
   # macOS/Linux
   brew services list  # or
   ps aux | grep mongod
   
   # Windows
   # Check Services app for "MongoDB"
   ```

3. Test connection:
   ```bash
   cd server
   npm run server
   ```

---

## Troubleshooting

### "MongoDB URI must start with mongodb:// or mongodb+srv://"
- **Problem**: Your connection string is missing the protocol
- **Fix**: Make sure it starts with `mongodb://` or `mongodb+srv://`

### "URI must include hostname, domain name, and tld"
- **Problem**: Connection string is incomplete or has placeholders
- **Fix**: 
  - Replace `<username>` and `<password>` with actual values
  - Make sure the cluster URL is complete (e.g., `cluster0.xxxxx.mongodb.net`)
  - Remove any extra spaces or quotes

### "Authentication failed"
- **Problem**: Wrong username/password
- **Fix**: 
  - Double-check credentials in MongoDB Atlas
  - If password has special characters, URL-encode them:
    - `@` → `%40`
    - `:` → `%3A`
    - `/` → `%2F`
    - `#` → `%23`
  - Or regenerate password in Atlas

### "Connection timeout" or "ECONNREFUSED"
- **Problem**: Network access not configured or MongoDB not running
- **Fix**:
  - **Atlas**: Add your IP address in Network Access
  - **Local**: Make sure MongoDB service is running:
    ```bash
    # macOS
    brew services start mongodb-community@7.0
    
    # Linux
    sudo systemctl start mongod
    
    # Windows
    # Start MongoDB service from Services app
    ```

### "Database name contains invalid characters"
- **Problem**: Database name has special characters
- **Fix**: Use simple names like `socialup`, `socialup_dev`, etc.

---

## Quick Reference

### MongoDB Atlas Connection String Format
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Local MongoDB Connection String Format
```
mongodb://127.0.0.1:27017/<database>
```

### Environment Variables Template
```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here

# Optional (have defaults)
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

---

## Recommended: MongoDB Atlas
- ✅ Free tier (512MB storage)
- ✅ No local installation needed
- ✅ Automatic backups
- ✅ Easy to share with team
- ✅ Scales easily
- ✅ Works from anywhere

## Local MongoDB
- ✅ Full control
- ✅ No internet required
- ✅ No storage limits
- ❌ Requires installation
- ❌ Manual backups needed
- ❌ Only accessible locally

---

## Next Steps
1. Choose your option (Atlas recommended)
2. Set up MongoDB
3. Create `server/.env` with connection string
4. Run `npm run server` in server directory
5. You should see: `MongoDB Connected: ...`
