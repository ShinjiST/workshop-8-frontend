import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Maintenance } from './types';
import type { MaintenanceFormValues } from './schema';

// ==== API функції ====

const getMaintenances = async (): Promise<Array<Maintenance>> => {
  // Запит списку
  const response = await apiClient.get('/maintenances');
  return response.data.data; 
};

const getMaintenanceById = async (id: number): Promise<Maintenance> => {
  const response = await apiClient.get(`/maintenances/${id}`);
  return response.data.data;
};

const createMaintenance = async (data: MaintenanceFormValues): Promise<Maintenance> => {
  const response = await apiClient.post('/maintenances', data);
  return response.data.data;
};

const updateMaintenance = async ({
  id,
  data,
}: {
  id: number;
  data: MaintenanceFormValues;
}): Promise<Maintenance> => {
  const response = await apiClient.put(`/maintenances/${id}`, data);
  return response.data.data;
};

const deleteMaintenance = async (id: number): Promise<void> => {
  await apiClient.delete(`/maintenances/${id}`);
};

// ==== Хуки для компонентів ====

export const useMaintenances = () => useQuery<Array<Maintenance>>({
  queryKey: ['maintenances'],
  queryFn: getMaintenances,
});

export const useMaintenance = (id: number) => useQuery<Maintenance>({
  queryKey: ['maintenances', id],
  queryFn: () => getMaintenanceById(id),
  enabled: !!id, // Запит йде тільки якщо id існує
});

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      // Перенаправлення на список після успішного створення
      navigate({ to: '/maintenances' as any });
    },
  });
};

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateMaintenance,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      // Оновлюємо кеш конкретного запису, щоб не робити зайвий запит
      queryClient.setQueryData(['maintenances', updated.m_id], updated);
      navigate({ to: '/maintenances' as any });
    },
  });
};

export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
    },
  });
};