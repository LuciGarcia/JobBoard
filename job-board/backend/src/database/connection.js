import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;

// Utilidades para resolver rutas relativas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  user: process.env.DB_USER || "jobboard_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "jobboard_db",
  password: process.env.DB_PASSWORD || "jobboard_password123",
  port: process.env.DB_PORT || 5432,
});

// Función para inicializar las tablas
const initDatabase = async () => {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sqlScript = fs.readFileSync(sqlPath, "utf8");

    await pool.query(sqlScript);
    console.log("Tablas de la Base de Datos verificadas/creadas con éxito.");
  } catch (err) {
    console.error(
      "Error al inicializar las tablas de la base de datos:",
      err.message,
    );
  }
};

// Verificar conexión e inicializar
pool.query("SELECT NOW()", async (err, res) => {
  if (err) {
    console.error("Error crítico al conectar a PostgreSQL:", err.stack);
  } else {
    console.log("Conexión a PostgreSQL establecida con éxito.");
    await initDatabase(); // Ejecuta el script SQL
  }
});

export default pool;
