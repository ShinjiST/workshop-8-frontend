// src/features/incidents/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Incident } from './types';

// ==== API функції ====

const getIncidents = async (): Promise<Array<Incident>> => {
  // Додаємо пагінацію за замовчуванням
  const response = await apiClient.get('/incidents?page=1&limit=100');
  return response.data.data;
};

const getIncidentById = async (id: number): Promise<Incident> => {
  const response = await apiClient.get(`/incidents/${id}`);
  return response.data.data;
};

const createIncident = async (data: Omit<Incident, 'inc_id'>): Promise<Incident> => {
  const response = await apiClient.post('/incidents', data);
  return response.data.data;
};

const updateIncident = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<Incident, 'inc_id'>>;
}): Promise<Incident> => {
  const response = await apiClient.put(`/incidents/${id}`, data);
  return response.data.data;
};

const deleteIncident = async (id: number): Promise<void> => {
  await apiClient.delete(`/incidents/${id}`);
};

// ==== Хуки для компонентів ====

export const useIncidents = () => useQuery<Array<Incident>>({
  queryKey: ['incidents'],
  queryFn: getIncidents,
});

export const useIncident = (id: number) => useQuery<Incident>({
  queryKey: ['incidents', id],
  queryFn: () => getIncidentById(id),
  enabled: !!id,
});

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      navigate({ to: '/incidents' as any });
    },
  });
};

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateIncident,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.setQueryData(['incidents', updated.inc_id], updated);
      navigate({ to: '/incidents' as any });
    },
  });
};

export const useDeleteIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};