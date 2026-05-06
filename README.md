# Fathom Marine Management System 🚢

A robust, full-stack web application designed for marine organizations to efficiently manage ship maintenance, track safety drills, and ensure regulatory compliance.

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom marine-themed utility classes)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Formatting**: date-fns

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (running via `ts-node` in development)
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs for secure password hashing

---

## ✨ Core Modules & Features

1. **Ship Maintenance Module**
   - **Admin**: Create tasks, assign them to specific ships and crew members, and manage statuses.
   - **Crew**: View assigned tasks, update progress (Start/Complete), and add detailed execution notes.
   - **Features**: Advanced filtering by Status, Ship, and Date.

2. **Safety Drill Module**
   - **Admin**: Schedule upcoming safety drills and designate them to specific ships. Override drill statuses manually.
   - **Crew**: View all upcoming drills, mark attendance, and mark drills as fully completed.
   - **Features**: Real-time overdue highlighting and status filtering.

3. **Compliance Dashboard**
   - Real-time aggregation of overall compliance metrics.
   - Calculates the percentage of maintenance completed and drill participation.
   - Automatically highlights overdue maintenance tasks and missed drills, marking the overall system as "Non-compliant" if thresholds are breached.

4. **Secure Authentication & RBAC**
   - **Signup/Login**: Dual-mode secure portal.
   - **Security**: Passwords are cryptographically hashed using `bcrypt`. Persistent sessions are maintained via `JWT`.
   - **Role-Based Access Control (RBAC)**: Distinct permissions and views for "Admin" and "Crew" roles.

---

## 🏛 Architecture Decisions

1. **TypeScript Migration**: The entire project (both MERN frontend and backend) was migrated from JavaScript to strictly-typed TypeScript. This ensures high code quality, catches runtime errors during compile time, and provides robust interface contracts across the API boundary.
2. **Context API for State Management**: Instead of heavy libraries like Redux, React's native `Context API` (`AuthContext`) was utilized for global user state management. This keeps the application lightweight and highly performant while securely managing JWT tokens.
3. **Decoupled Client-Server Architecture**: The React frontend and Node/Express backend are completely decoupled. They communicate exclusively via RESTful JSON APIs, enabling independent scaling and future mobile app integration.
4. **Fat Model, Skinny Controller**: Business logic and required field validations (like unique emails and enum roles) are strictly enforced at the MongoDB schema level using Mongoose, keeping API routes clean and focused strictly on HTTP transport logic.
5. **Dynamic Compliance Calculation**: Instead of storing static compliance percentages in the database, the dashboard metrics are calculated dynamically on the fly based on the real-time status of Tasks and Drills. This prevents data staleness and synchronization bugs.

---

## 🚀 Setup Instructions

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- A running MongoDB instance (or a MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FathomMarineAssignment
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure your environment variables:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5001` using `ts-node`.*

### 3. Frontend Setup
1. Open a new terminal window and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* If your backend is running on a different port, create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

### 4. Testing the Application
- Open your browser and go to `http://localhost:5173`.
- **Create an Account**: Use the Signup tab to create a new Admin or Crew account.
- **Demo Accounts**: You can also use pre-seeded accounts if applicable.
- Explore the Maintenance, Drills, and Dashboard sections to see the application in action!
