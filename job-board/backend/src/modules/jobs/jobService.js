import pool from "../../database/connection.js";

class JobService {
  // 1. CREAR OFERTA (Requiere saber el ID de perfil de la empresa)
  async createJob(userId, jobData) {
    // Buscar el id de perfil de la empresa usando el id de usuario
    const companyRes = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId],
    );
    const companyId = companyRes.rows[0]?.id;

    if (!companyId)
      throw new Error("No se encontró el perfil de empresa para este usuario.");

    const {
      title,
      description,
      requirements,
      benefits,
      category,
      location,
      work_mode,
      job_type,
      salary_min,
      salary_max,
    } = jobData;

    const query = `
      INSERT INTO job_offers (company_id, title, description, requirements, benefits, category, location, work_mode, job_type, salary_min, salary_max)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      companyId,
      title,
      description,
      requirements,
      benefits,
      category,
      location,
      work_mode,
      job_type,
      salary_min,
      salary_max,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 2. LISTAR OFERTAS CON FILTROS DINÁMICOS (Público)
  async getAllJobs(filters) {
    const { category, location, work_mode, job_type, search } = filters;

    let query = `
      SELECT j.*, c.company_name, c.logo_url 
      FROM job_offers j
      JOIN company_profiles c ON j.company_id = c.id
      WHERE j.status = 'active'
    `;
    const values = [];
    let placeholderIndex = 1;

    if (category) {
      query += ` AND j.category = $${placeholderIndex}`;
      values.push(category);
      placeholderIndex++;
    }

    if (location) {
      query += ` AND j.location ILIKE $${placeholderIndex}`;
      values.push(`%${location}%`);
      placeholderIndex++;
    }

    if (work_mode !== undefined) {
      // remote | onsite | hybrid
      query += ` AND j.work_mode = $${placeholderIndex}`;
      values.push("%${work_mode}%");
      placeholderIndex++;
    }

    if (job_type) {
      query += ` AND j.job_type = $${placeholderIndex}`;
      values.push(job_type);
      placeholderIndex++;
    }

    if (search) {
      query += ` AND (j.title ILIKE $${placeholderIndex} OR j.description ILIKE $${placeholderIndex})`;
      values.push(`%${search}%`);
      placeholderIndex++;
    }

    query += " ORDER BY j.created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new JobService();
