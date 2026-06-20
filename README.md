# PredictAI Placement System

This repository contains the full source code for the PredictAI Placement System. It is a monorepo consisting of a FastAPI backend, a React web frontend, and a Capacitor-powered mobile application.

## 📂 Project Structure

- **`/backend`**: FastAPI application handling AI predictions, resume parsing (via Gemini API), and PostgreSQL database operations.
- **`/frontend`**: React + Vite web application built with a modern glassmorphism UI.
- **`/mobile`**: React + Vite + Capacitor mobile application, sharing the same UI language as the web frontend but optimized for touch interfaces and native Android deployment.

---

## 🛠️ Prerequisites

To run this project locally and build the mobile app, you need:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for running the database and backend easily)
- [Android Studio](https://developer.android.com/studio) (for building the mobile APK)

---

## 🚀 Getting Started (Local Development)

### 1. Backend & Database (via Docker)
The easiest way to run the backend and the PostgreSQL database locally is using Docker.

```bash
# In the root directory:
docker compose up --build
```
*The backend API will be available at `http://localhost:8000`.*

> **Note:** If you run it natively without Docker, ensure you create a `.env` file in the `backend/` directory containing your `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY`.

### 2. Web Frontend
```bash
# Open a new terminal and navigate to the frontend:
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The web app will be available at `http://localhost:5173`.*

### 3. Mobile App (Development)
```bash
# Open a new terminal and navigate to the mobile app:
cd mobile

# Install dependencies
npm install

# Start the development server (for browser testing)
npm run dev
```

---

## 📱 Building the Android App (APK)

Follow these steps to build the `.apk` file so you can install and test the app on a physical Android device.

### Step 1: Configure Environment Variables
Inside the `mobile/` directory, create a `.env.production` file. Set the API URL to point to your **production deployed backend** (e.g., on Render):

```env
VITE_API_URL=https://your-backend-api-url.com
```
*(If you are testing locally on an emulator, use your local network IP instead of localhost).*

### Step 2: Build the Web Assets
Capacitor requires a production build of your React app before it can be synced to Android.
```bash
cd mobile
npm run build --mode production
```
*This generates a `dist/` folder containing your compiled code with the injected API URL.*

### Step 3: Add & Sync the Android Platform
If you haven't already added the Android platform to your project, run:
```bash
npm install @capacitor/android
npx cap add android
```

Sync your newly built web assets into the native Android codebase:
```bash
npx cap sync android
```

### Step 4: Build the APK in Android Studio
1. Open the project in Android Studio directly from the terminal:
   ```bash
   npx cap open android
   ```
2. Wait for Android Studio to finish the **Gradle Sync** (watch the progress bar at the bottom).
3. Once the sync is complete, go to the top menu bar and click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Android Studio will compile the app. When it finishes, a notification popup will appear in the bottom right corner. Click the **"locate"** link to find your newly generated `app-debug.apk` file.

You can now copy this APK to an Android device and install it!
