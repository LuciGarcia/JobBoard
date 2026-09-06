import express from "express";
import authService from "./authService.js";

const router = express.Router();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key_temporal",
    );
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// Endpoint: POST /api/v1/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Validación básica de entrada
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios (email, password, role)." });
    }
    if (role !== "company" && role !== "candidate") {
      return res
        .status(400)
        .json({ error: 'El rol debe ser "company" o "candidate".' });
    }

    const newUser = await authService.register({ email, password, role, name });
    res
      .status(201)
      .json({ message: "Usuario registrado con éxito.", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint: POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos." });
    }

    const data = await authService.login({ email, password });
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// GET /api/v1/auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await authService.getMe(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
