import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../api/applicationsApi";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const STATUS_CONFIG = {
  pending: { label: "En revisión", color: "bg-yellow-100 text-yellow-700" },
  reviewed: { label: "Revisada", color: "bg-blue-100 text-blue-700" },
  accepted: { label: "Aceptada", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rechazada", color: "bg-red-100 text-red-700" },
};

export default function CandidateDashboard() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Mis postulaciones
      </h1>
      <p className="text-gray-500 mb-8">
        {applications?.length ?? 0} postulaciones realizadas
      </p>

      {applications?.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400 mb-4">
            Todavía no aplicaste a ninguna oferta
          </p>
          <Link to="/jobs" className="text-blue-600 hover:underline text-sm">
            Ver ofertas disponibles
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {applications?.map((app) => {
          const statusInfo = STATUS_CONFIG[app.status];
          return (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {app.job.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {app.job.company.company_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Aplicaste el{" "}
                    {new Date(app.created_at).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
