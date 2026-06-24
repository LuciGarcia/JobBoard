import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./database/connection.js";
import authRouter from "./modules/auth/authController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor y entorno activos." });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
