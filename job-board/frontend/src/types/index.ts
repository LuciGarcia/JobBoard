// Estos tipos deben coincidir con lo que devuelve tu backend

export type UserRole = "company" | "candidate";

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements: string;
  category: string;
  location: string;
  is_remote: boolean;
  job_type: "full_time" | "part_time" | "contract" | "freelance";
  salary_min?: number; // El ? significa que puede ser undefined (campo opcional)
  salary_max?: number;
  status: "active" | "paused" | "closed";
  created_at: string;
  company: {
    company_name: string;
    logo_url?: string;
  };
}

export interface Application {
  id: number;
  job: JobOffer;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
  cover_letter?: string;
}

// Para el login/registro
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Para los filtros de búsqueda
export interface JobFilters {
  category?: string;
  location?: string;
  is_remote?: boolean;
  job_type?: string;
  search?: string;
}
