import api from "./axiosConfig";
import type { JobOffer, JobFilters } from "../types";

export const getJobs = async (filters?: JobFilters): Promise<JobOffer[]> => {
  // Convertimos el objeto de filtros en query params: ?category=tech&location=Mendoza
  const response = await api.get<JobOffer[]>("/jobs", { params: filters });
  return response.data;
};

export const getJobById = async (id: number): Promise<JobOffer> => {
  const response = await api.get<JobOffer>(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (data: Partial<JobOffer>): Promise<JobOffer> => {
  const response = await api.post<JobOffer>("/jobs", data);
  return response.data;
};

export const updateJob = async (
  id: number,
  data: Partial<JobOffer>,
): Promise<JobOffer> => {
  const response = await api.put<JobOffer>(`/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};

export const getMyJobs = async (): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>("/jobs/my-offers");
  return response.data;
};
