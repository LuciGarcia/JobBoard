import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env
const envPath = path.join(__dirname, "..", "..", ".env");
const result = dotenv.config({ path: envPath });

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("Ruta .env:", envPath);

if (result.error) {
  console.error("No se pudo cargar el .env desde:", envPath);
} else {
  console.log("Variables de entorno cargadas desde:", envPath);
}

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT), // Convertimos a número explícitamente
});

// Verificar conexión e inicializar tablas
const initDatabase = async () => {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sqlScript = fs.readFileSync(sqlPath, "utf8");
    await pool.query(sqlScript);
    console.log("Tablas verificadas/creadas con éxito.");
  } catch (err) {
    console.error("Error al inicializar las tablas:", err.message);
  }
};

pool.query("SELECT NOW()", async (err, res) => {
  if (err) {
    console.error("Error crítico al conectar a PostgreSQL:", err.stack);
  } else {
    console.log(
      "Conexión a PostgreSQL establecida. Servidor:",
      res.rows[0].now,
    );
    await initDatabase();
  }
});

export default pool;
