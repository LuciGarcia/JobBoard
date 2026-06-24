import pool from "../../database/connection.js";

class ApplicationService {
  // 1. CREAR POSTULACIÓN (Solo para Candidatos)
  async applyToJob(userId, jobId, coverLetter) {
    // Buscar el id de perfil del candidato mediante el id de usuario autenticado
    const candidateRes = await pool.query(
      "SELECT id FROM candidate_profiles WHERE user_id = $1",
      [userId],
    );
    const candidateId = candidateRes.rows[0]?.id;

    if (!candidateId)
      throw new Error(
        "No se encontró el perfil de candidato para este usuario.",
      );

    try {
      const query = `
        INSERT INTO applications (job_id, candidate_id, cover_letter)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [jobId, candidateId, coverLetter]);
      return result.rows[0];
    } catch (error) {
      // Manejar el error de restricción única de Postgres (Código 23505)
      if (error.code === "23505") {
        throw new Error(
          "Ya te has postulado a esta oferta laboral previamente.",
        );
      }
      throw error;
    }
  }

  // 2. VER POSTULANTES (Solo para la Empresa dueña de la oferta)
  async getApplicantsByJob(userId, jobId) {
    // Verificar primero que la oferta pertenezca a la empresa que consulta
    const verifyQuery = `
      SELECT j.id FROM job_offers j
      JOIN company_profiles c ON j.company_id = c.id
      WHERE j.id = $1 AND c.user_id = $2
    `;
    const verifyRes = await pool.query(verifyQuery, [jobId, userId]);

    if (verifyRes.rows.length === 0) {
      throw new Error(
        "No tenés permisos para ver los postulantes de esta oferta o no existe.",
      );
    }

    const query = `
      SELECT a.id as application_id, a.status, a.cover_letter, a.created_at,
             cp.full_name, cp.headline, cp.bio, cp.cv_url
      FROM applications a
      JOIN candidate_profiles cp ON a.candidate_id = cp.id
      WHERE a.job_id = $1
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [jobId]);
    return result.rows;
  }
}

export default new ApplicationService();
