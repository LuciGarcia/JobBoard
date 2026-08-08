import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../../api/jobsApi";
import type { JobFilters } from "../../types";
import JobCard from "../../components/jobs/JobCard";
import JobFiltersPanel from "../../components/jobs/JobFilters";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function JobListPage() {
  // Estado local para los filtros activos
  const [filters, setFilters] = useState<JobFilters>({});

  // useQuery maneja automáticamente: loading, error, y caché de datos
  // La key ['jobs', filters] hace que cuando cambien los filtros, se vuelva a pedir al backend
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Ofertas de trabajo
      </h1>
      <p className="text-gray-500 mb-8">
        {jobs?.length ?? 0} posiciones disponibles
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de filtros (columna izquierda en desktop) */}
        <div className="lg:col-span-1">
          <JobFiltersPanel filters={filters} onChange={setFilters} />
        </div>

        {/* Listado de ofertas (columna derecha) */}
        <div className="lg:col-span-3">
          {isLoading && <LoadingSpinner />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              Error al cargar las ofertas. ¿Tu backend está corriendo?
            </div>
          )}

          {!isLoading && jobs?.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>No hay ofertas que coincidan con los filtros</p>
            </div>
          )}

          {/* Mapeamos el array de ofertas a componentes JobCard */}
          <div className="space-y-4">
            {jobs?.map((job) => (
              <JobCard key={job.id} job={job} />
              // La prop "key" es requerida por React para identificar cada elemento de la lista
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
