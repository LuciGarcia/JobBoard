import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../api/jobsApi";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function CompanyDashboard() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: getMyJobs,
  });

  // useMutation: para operaciones que modifican datos (POST, PUT, DELETE)
  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      // Invalida el caché de 'my-jobs' para que React Query vuelva a pedirlos
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar esta oferta?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis ofertas</h1>
        <Link
          to="/company/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Nueva oferta
        </Link>
      </div>

      {jobs?.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400 mb-4">
            No publicaste ninguna oferta todavía
          </p>
          <Link
            to="/company/jobs/new"
            className="text-blue-600 hover:underline text-sm"
          >
            Publicar primera oferta
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {jobs?.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {job.location} · {job.category}
                </p>
              </div>

              {/* Badge de estado */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  job.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {job.status === "active" ? "Activa" : "Pausada"}
              </span>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 mt-4">
              <Link
                to={`/company/jobs/${job.id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                Editar
              </Link>
              <Link
                to={`/company/jobs/${job.id}/applications`}
                className="text-sm text-gray-600 hover:underline"
              >
                Ver postulantes
              </Link>
              <button
                onClick={() => handleDelete(job.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
