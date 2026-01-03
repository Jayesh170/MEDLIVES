# Docker Setup for Kafka

## Issue
`docker-compose` or `docker compose` command not found.

## Solution: Install Docker Desktop

### Step 1: Download Docker Desktop
1. Go to: https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Windows
3. Run the installer

### Step 2: Install Docker Desktop
1. Follow the installation wizard
2. **Important:** Enable WSL 2 backend (if prompted)
3. Restart your computer if required

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
docker --version
docker compose version
```

You should see version numbers for both commands.

### Step 4: Start Docker Desktop
1. Launch Docker Desktop from Start Menu
2. Wait for it to start (whale icon in system tray)
3. Verify it's running (should show "Docker Desktop is running")

### Step 5: Start Kafka
```powershell
cd Medlives-backend
npm run kafka:up
```

---

## Alternative: Use Docker Compose Standalone

If you prefer not to install Docker Desktop, you can install Docker Compose standalone:

### Option A: Using Chocolatey
```powershell
choco install docker-compose
```

### Option B: Manual Installation
1. Download from: https://github.com/docker/compose/releases
2. Extract `docker-compose.exe` to a folder in your PATH
3. Or place it in `C:\Windows\System32\`

---

## Verify Docker is Working

After installation, test with:
```powershell
docker ps
docker compose version
```

Both commands should work without errors.

---

## Troubleshooting

### Docker Desktop Not Starting
- Check Windows features: Enable "Virtual Machine Platform" and "Windows Subsystem for Linux"
- Update Windows to latest version
- Check BIOS settings for virtualization (VT-x/AMD-V)

### Port Already in Use
If port 9092 or 2181 is already in use:
```powershell
# Check what's using the port
netstat -ano | findstr :9092
netstat -ano | findstr :2181

# Stop the process or change ports in docker-compose.yml
```

### Permission Issues
Run PowerShell as Administrator if you encounter permission errors.

---

## Next Steps After Docker Installation

1. ✅ Install Docker Desktop
2. ✅ Start Docker Desktop
3. ✅ Run: `npm run kafka:up`
4. ✅ Run: `npm run setup-kafka`
5. ✅ Start backend: `npm run dev`

---

## Alternative: Use Cloud Kafka (Without Docker)

If you don't want to use Docker, you can use a cloud Kafka service:

### Option 1: Confluent Cloud (Free Tier)
- Sign up at: https://www.confluent.io/confluent-cloud/
- Create a cluster (free tier available)
- Get connection details
- Update `.env`: `KAFKA_BROKERS=your-cloud-broker:9092`

### Option 2: Upstash Kafka (Free Tier)
- Sign up at: https://upstash.com/
- Create Kafka cluster
- Get connection string
- Update `.env` with connection details

### Option 3: Local Kafka Installation (Advanced)
Install Kafka directly on Windows (not recommended, complex setup)

---

**Recommended:** Install Docker Desktop for easiest setup and local development.

