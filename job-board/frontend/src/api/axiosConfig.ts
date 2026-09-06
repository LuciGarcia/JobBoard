import axios from "axios";

// Creamos una instancia de Axios preconfigurada
const api = axios.create({
  // La URL base de tu backend Express. Ajustá el puerto si es diferente.
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR DE REQUEST: se ejecuta antes de cada pedido al backend
// Su función: adjuntar el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Leemos el token guardado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Lo adjuntamos al header
  }
  return config;
});

// INTERCEPTOR DE RESPONSE: se ejecuta cuando llega la respuesta del backend
// Su función: si el backend responde 401 (no autorizado), cerramos sesión
api.interceptors.response.use(
  (response) => response, // Si todo está bien, devolvemos la respuesta sin cambios
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido → limpiamos y mandamos al login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error); // Propagamos el error para que el componente lo maneje
  },
);

export default api;
