// src/features/parkingzones/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios'; // заменили alias на относительный путь
import type { ParkingZone } from './types';

// ==== API функции ====
const getParkingZones = async (): Promise<Array<ParkingZone>> => {
  const response = await apiClient.get('/parkingzones');
  return response.data.data; // <-- вот здесь берем массив
};

const getParkingZoneById = async (id: number): Promise<ParkingZone> => {
  const response = await apiClient.get(`/parkingzones/${id}`);
  return response.data.data; // <-- если эндпоинт возвращает объект с data
};

const createParkingZone = async (data: Omit<ParkingZone, 'pz_id'>): Promise<ParkingZone> => {
  const response = await apiClient.post('/parkingzones', data);
  return response.data.data;
};

const updateParkingZone = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<ParkingZone, 'pz_id'>>;
}): Promise<ParkingZone> => {
  const response = await apiClient.put(`/parkingzones/${id}`, data);
  return response.data;
};

const deleteParkingZone = async (id: number): Promise<void> => {
  await apiClient.delete(`/parkingzones/${id}`);
};

// ==== Хуки для компонентов ====
export const useParkingZones = () => useQuery<Array<ParkingZone>>({
  queryKey: ['parkingzones'],
  queryFn: getParkingZones,
});

export const useParkingZone = (id: number) => useQuery<ParkingZone>({
  queryKey: ['parkingzones', id],
  queryFn: () => getParkingZoneById(id),
});

export const useCreateParkingZone = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createParkingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingzones'] });
      navigate({ to: '/parkingzones' });
    },
  });
};

export const useUpdateParkingZone = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateParkingZone,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['parkingzones'] });
      queryClient.setQueryData(['parkingzones', updated.pz_id], updated);
      navigate({ to: '/parkingzones' });
    },
  });
};

export const useDeleteParkingZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParkingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingzones'] });
    },
  });
};
