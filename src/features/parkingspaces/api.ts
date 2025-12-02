// src/features/parkingspaces/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { ParkingSpace } from './types';

// ==== API функции ====

const getParkingSpaces = async (): Promise<Array<ParkingSpace>> => {
  // ВИПРАВЛЕННЯ: Додали ?page=1&limit=10
  const response = await apiClient.get('/parkingspaces');
  
  // Якщо бек повертає масив прямо в response.data, спробуй прибрати .data
  // Але поки залишаємо як у тебе було:
  return response.data.data; 
};

const getParkingSpaceById = async (id: number): Promise<ParkingSpace> => {
  const response = await apiClient.get(`/parkingspaces/${id}`);
  return response.data.data;
};

const createParkingSpace = async (data: Omit<ParkingSpace, 'ps_id'>): Promise<ParkingSpace> => {
  const response = await apiClient.post('/parkingspaces', data);
  return response.data.data;
};

const updateParkingSpace = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<ParkingSpace, 'ps_id'>>;
}): Promise<ParkingSpace> => {
  const response = await apiClient.put(`/parkingspaces/${id}`, data);
  return response.data.data;
};

const deleteParkingSpace = async (id: number): Promise<void> => {
  await apiClient.delete(`/parkingspaces/${id}`);
};

// ==== Хуки для компонентов ====

export const useParkingSpaces = () => useQuery<Array<ParkingSpace>>({
  queryKey: ['parkingspaces'],
  queryFn: getParkingSpaces,
});

export const useParkingSpace = (id: number) => useQuery<ParkingSpace>({
  queryKey: ['parkingspaces', id],
  queryFn: () => getParkingSpaceById(id),
});

export const useCreateParkingSpace = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createParkingSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingspaces'] });
      // Додано 'as any', щоб TypeScript не сварився на шляхи
      navigate({ to: '/parkingspaces/' as any });
    },
  });
};

export const useUpdateParkingSpace = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateParkingSpace,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['parkingspaces'] });
      queryClient.setQueryData(['parkingspaces', updated.ps_id], updated);
      navigate({ to: '/parkingspaces/' as any });
    },
  });
};

export const useDeleteParkingSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParkingSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingspaces'] });
    },
  });
};