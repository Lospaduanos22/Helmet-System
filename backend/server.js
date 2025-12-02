import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// 1. Import the locker routes
import lockerRoutes from "./routes/lockerRoutes.js"; 

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 Request received: ${req.method} ${req.url}`);
  next();
});

// 2. Add the route middleware here
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/lockers", lockerRoutes); // <--- THIS WAS MISSING

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