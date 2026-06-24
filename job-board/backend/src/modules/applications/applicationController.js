import express from "express";
import applicationService from "./applicationService.js";
import { requireAuth, requireRole } from "../../shared/authMiddleware.js";

const router = express.Router();

// POST /api/v1/applications/:jobId -> Postularse a un empleo (Solo candidatos)
router.post(
  "/:jobId",
  requireAuth,
  requireRole("candidate"),
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const { cover_letter } = req.body;

      const newApplication = await applicationService.applyToJob(
        req.user.userId,
        jobId,
        cover_letter,
      );
      res
        .status(201)
        .json({
          message: "Postulación enviada con éxito.",
          application: newApplication,
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// GET /api/v1/applications/job/:jobId -> Ver postulantes de una oferta (Solo la empresa creadora)
router.get(
  "/job/:jobId",
  requireAuth,
  requireRole("company"),
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const applicants = await applicationService.getApplicantsByJob(
        req.user.userId,
        jobId,
      );
      res.status(200).json(applicants);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  },
);

export default router;
