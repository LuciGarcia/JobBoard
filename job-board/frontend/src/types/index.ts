export interface User {
  id: number;
  email: string;
  role: "company" | "candidate"; // Restringido estrictamente a estos dos strings
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export interface JobOffer {
  id: number;
  company_id: number;
  company_name?: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  category: string;
  location: string;
  is_remote: boolean;
  job_type: "full_time" | "part_time" | "contract" | "freelance";
  salary_min?: number;
  salary_max?: number;
  status: "active" | "paused" | "closed";
  created_at: string;
}
