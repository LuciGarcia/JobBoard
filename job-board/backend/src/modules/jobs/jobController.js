import express from "express";
import jobService from "./jobService.js";
import { requireAuth, requireRole } from "../../shared/authMiddleware.js";

const router = express.Router();

// POST /api/v1/jobs -> Crear oferta (Solo empresas autenticadas)
router.post("/", requireAuth, requireRole("company"), async (req, res) => {
  try {
    // req.user.userId viene inyectado de forma segura desde el token por el middleware
    const newJob = await jobService.createJob(req.user.userId, req.body);
    res
      .status(201)
      .json({ message: "Oferta laboral publicada con éxito.", job: newJob });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/jobs -> Ver y filtrar ofertas (Público)
router.get("/", async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs(req.query);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
