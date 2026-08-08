import type { JobFilters } from "../../types";

const CATEGORIES = [
  "tecnología",
  "marketing",
  "ventas",
  "administración",
  "diseño",
  "finanzas",
  "ingeniería",
  "educación",
  "otro",
];

const JOB_TYPES = [
  { value: "full_time", label: "Tiempo completo" },
  { value: "part_time", label: "Medio tiempo" },
  { value: "contract", label: "Contrato" },
  { value: "freelance", label: "Freelance" },
];

interface JobFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void; // Callback: notifica al padre cuando cambia un filtro
}

export default function JobFiltersPanel({
  filters,
  onChange,
}: JobFiltersProps) {
  // Función auxiliar para actualizar un solo campo del filtro
  const updateFilter = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value || undefined });
    //         ↑ Spread: copiamos todos los filtros existentes y sobreescribimos solo el que cambió
  };

  return (
    <aside className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-gray-900">Filtros</h3>

      {/* Búsqueda por texto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Puesto, empresa..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <select
          value={filters.category || ""}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de trabajo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          value={filters.job_type || ""}
          onChange={(e) => updateFilter("job_type", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          {JOB_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ubicación */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ubicación
        </label>
        <input
          type="text"
          value={filters.location || ""}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="Ej: Mendoza"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Checkbox remoto */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_remote"
          checked={filters.is_remote || false}
          onChange={(e) =>
            updateFilter("is_remote", e.target.checked || undefined)
          }
          className="rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="is_remote" className="text-sm text-gray-700">
          Solo posiciones remotas
        </label>
      </div>

      {/* Botón limpiar filtros */}
      <button
        onClick={() => onChange({})}
        className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
