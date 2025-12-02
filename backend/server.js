import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// 1. ALLOW CORS
// Allows connections from your Vite frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// 2. DEBUG LOGGING
// Prints requests to the terminal so you can see if they arrive
app.use((req, res, next) => {
  console.log(`📡 Request received: ${req.method} ${req.url}`);
  next();
});

// 3. ROUTES
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ⚠️ CHANGED TO 5001 TO AVOID MAC AIRPLAY CONFLICT
const PORT = 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
  /**
   import express from "express";
  import cors from "cors";
  import studentRoutes from "./routes/studentRoutes.js";
  import userRoutes from "./routes/userRoutes.js";
  import adminRoutes from "./routes/adminRoutes.js"; // <- new

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/students", studentRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes); // <- new admin endpoints

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  */