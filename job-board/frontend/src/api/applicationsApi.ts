import api from "./axiosConfig";
import type { Application } from "../types";

export const applyToJob = async (
  jobId: number,
  coverLetter?: string,
): Promise<Application> => {
  const response = await api.post<Application>(`/applications/${jobId}`, {
    cover_letter: coverLetter,
  });
  return response.data;
};

export const getMyApplications = async (): Promise<Application[]> => {
  const response = await api.get<Application[]>(
    "/applications/my-applications",
  );
  return response.data;
};

export const getApplicationsForJob = async (
  jobId: number,
): Promise<Application[]> => {
  const response = await api.get<Application[]>(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (
  id: number,
  status: Application["status"],
): Promise<Application> => {
  const response = await api.patch<Application>(`/applications/${id}/status`, {
    status,
  });
  return response.data;
};
