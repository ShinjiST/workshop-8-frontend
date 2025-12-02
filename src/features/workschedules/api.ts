// src/features/workschedules/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { WorkSchedule } from './types';

// ==== API функції ====

const getWorkSchedules = async (): Promise<Array<WorkSchedule>> => {
  // Додаємо пагінацію, як у прикладі
  const response = await apiClient.get('/workschedules?page=1&limit=100');
  return response.data.data;
};

const getWorkScheduleById = async (id: number): Promise<WorkSchedule> => {
  const response = await apiClient.get(`/workschedules/${id}`);
  return response.data.data;
};

const createWorkSchedule = async (data: Omit<WorkSchedule, 'ws_id'>): Promise<WorkSchedule> => {
  const response = await apiClient.post('/workschedules', data);
  return response.data.data;
};

const updateWorkSchedule = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<WorkSchedule, 'ws_id'>>;
}): Promise<WorkSchedule> => {
  const response = await apiClient.put(`/workschedules/${id}`, data);
  return response.data.data;
};

const deleteWorkSchedule = async (id: number): Promise<void> => {
  await apiClient.delete(`/workschedules/${id}`);
};

// ==== Хуки для компонентів ====

export const useWorkSchedules = () => useQuery<Array<WorkSchedule>>({
  queryKey: ['workschedules'],
  queryFn: getWorkSchedules,
});

export const useWorkSchedule = (id: number) => useQuery<WorkSchedule>({
  queryKey: ['workschedules', id],
  queryFn: () => getWorkScheduleById(id),
  enabled: !!id,
});

export const useCreateWorkSchedule = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createWorkSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workschedules'] });
      navigate({ to: '/workschedules' as any });
    },
  });
};

export const useUpdateWorkSchedule = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateWorkSchedule,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['workschedules'] });
      queryClient.setQueryData(['workschedules', updated.ws_id], updated);
      navigate({ to: '/workschedules' as any });
    },
  });
};

export const useDeleteWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workschedules'] });
    },
  });
};