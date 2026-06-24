import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./database/connection.js";
import authRouter from "./modules/auth/authController.js";
import jobsRouter from "./modules/jobs/jobController.js";
import applicationsRouter from "./modules/applications/applicationController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/applications", applicationsRouter);

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor y entorno activos." });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
