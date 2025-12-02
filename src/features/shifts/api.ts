// src/features/shifts/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Shift } from './types';

// ==== API функції ====

const getShifts = async (): Promise<Array<Shift>> => {
  // Додаємо пагінацію, якщо бекенд її підтримує за замовчуванням
  const response = await apiClient.get('/shifts?page=1&limit=100');
  return response.data.data;
};

const getShiftById = async (id: number): Promise<Shift> => {
  const response = await apiClient.get(`/shifts/${id}`);
  return response.data.data;
};

const createShift = async (data: Omit<Shift, 'sh_id'>): Promise<Shift> => {
  const response = await apiClient.post('/shifts', data);
  return response.data.data;
};

const updateShift = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<Shift, 'sh_id'>>;
}): Promise<Shift> => {
  const response = await apiClient.put(`/shifts/${id}`, data);
  return response.data.data;
};

const deleteShift = async (id: number): Promise<void> => {
  await apiClient.delete(`/shifts/${id}`);
};

// ==== Хуки для компонентів ====

export const useShifts = () => useQuery<Array<Shift>>({
  queryKey: ['shifts'],
  queryFn: getShifts,
});

export const useShift = (id: number) => useQuery<Shift>({
  queryKey: ['shifts', id],
  queryFn: () => getShiftById(id),
  enabled: !!id, // Запит йде тільки якщо є ID
});

export const useCreateShift = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      // Перенаправлення на список змін після створення
      navigate({ to: '/shifts' as any });
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateShift,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      // Оновлюємо кеш конкретного елемента, щоб не робити зайвий запит
      queryClient.setQueryData(['shifts', updated.sh_id], updated);
      navigate({ to: '/shifts' as any });
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};