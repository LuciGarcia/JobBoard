import jwt from "jsonwebtoken";

// Middleware para verificar que el usuario está logueado
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Acceso denegado. No se proporcionó un token válido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key_temporal",
    );
    req.user = decoded; // Inyectamos los datos del token (userId y role) en la petición
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// Middleware para restringir por rol
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error:
            "Prohibido. No tenés los permisos necesarios para esta acción.",
        });
    }
    next();
  };
};
