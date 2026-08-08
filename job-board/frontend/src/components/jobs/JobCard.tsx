import { Link } from "react-router-dom";
import type { JobOffer } from "../../types";

// Mapa para mostrar nombres legibles de los tipos de trabajo
const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Tiempo completo",
  part_time: "Medio tiempo",
  contract: "Contrato",
  freelance: "Freelance",
};

interface JobCardProps {
  job: JobOffer;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link to={`/jobs/${job.id}`} className="block">
      {" "}
      {/* Toda la card es clickeable */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all">
        {/* Header: empresa y fecha */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">{job.company.company_name}</p>
            <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(job.created_at).toLocaleDateString("es-AR")}
          </span>
        </div>

        {/* Tags: ubicación, tipo, remoto */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
            📍 {job.location}
          </span>
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
            {JOB_TYPE_LABELS[job.job_type] || job.job_type}
          </span>
          {job.is_remote && (
            <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs">
              🌐 Remoto
            </span>
          )}
          <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs">
            {job.category}
          </span>
        </div>

        {/* Salario (si está disponible) */}
        {job.salary_min && (
          <p className="mt-3 text-sm text-gray-600">
            💰 ${job.salary_min.toLocaleString()}
            {job.salary_max ? ` — $${job.salary_max.toLocaleString()}` : "+"}
          </p>
        )}
      </div>
    </Link>
  );
}
