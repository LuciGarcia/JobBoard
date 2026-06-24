import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../database/connection.js";

class AuthService {
  // 1. REGISTRO DE USUARIOS
  async register({ email, password, role, name }) {
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (userExists.rows.length > 0) {
      throw new Error("El correo electrónico ya está registrado.");
    }

    // Hashear la contraseña (seguridad)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Iniciar una transacción SQL para asegurar que se cree el usuario Y su perfil obligatoriamente
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insertar en la tabla 'users'
      const userQuery = `
        INSERT INTO users (email, password_hash, role) 
        VALUES ($1, $2, $3) RETURNING id, email, role
      `;
      const userResult = await client.query(userQuery, [
        email,
        passwordHash,
        role,
      ]);
      const newUser = userResult.rows[0];

      // Insertar en la tabla de perfil correspondiente según el rol
      if (role === "company") {
        await client.query(
          "INSERT INTO company_profiles (user_id, company_name) VALUES ($1, $2)",
          [newUser.id, name || "Mi Empresa"],
        );
      } else if (role === "candidate") {
        await client.query(
          "INSERT INTO candidate_profiles (user_id, full_name) VALUES ($1, $2)",
          [newUser.id, name || "Nuevo Candidato"],
        );
      }

      await client.query("COMMIT");
      return newUser;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // 2. LOGIN DE USUARIOS
  async login({ email, password }) {
    // Buscar usuario por email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !user.is_active) {
      throw new Error("Credenciales inválidas o usuario inactivo.");
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Credenciales inválidas.");
    }

    // Generar el token JWT incluyendo id y rol
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret_key_temporal",
      {
        expiresIn: "1d",
      },
    );

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}

export default new AuthService();
