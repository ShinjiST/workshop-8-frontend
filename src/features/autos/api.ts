// src/features/autos/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Auto } from './types';

// ==== Утиліти типів ====
// 💡 Створення: Всі поля, крім ID та зв'язків
type AutoCreateData = Omit<Auto, 'at_id' | 'agreements'>; 
// 💡 Оновлення: Частина полів, крім ID та зв'язків
type AutoUpdateData = Partial<Omit<Auto, 'at_id' | 'agreements'>>;

// ==== API функції ====

const getAutos = async (): Promise<Array<Auto>> => {
    const response = await apiClient.get('/autos');
    return response.data.data; 
};

const getAutoById = async (id: number): Promise<Auto> => {
    const response = await apiClient.get(`/autos/${id}`);
    return response.data.data;
};

const createAuto = async (data: AutoCreateData): Promise<Auto> => {
    const response = await apiClient.post('/autos', data);
    return response.data.data;
};

const updateAuto = async ({
    id,
    data,
}: {
    id: number;
    data: AutoUpdateData; 
}): Promise<Auto> => {
    const response = await apiClient.put(`/autos/${id}`, data);
    return response.data.data;
};

const deleteAuto = async (id: number): Promise<void> => {
    await apiClient.delete(`/autos/${id}`);
};

// ==== Хуки для компонентов ====

export const useAutos = () => useQuery<Array<Auto>>({
    queryKey: ['autos'],
    queryFn: getAutos,
});

export const useAuto = (id: number) => useQuery<Auto>({
    queryKey: ['autos', id],
    queryFn: () => getAutoById(id),
    enabled: !!id, 
});

export const useCreateAuto = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createAuto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autos'] });
            // Перенаправлення на список
            navigate({ to: '/autos/' as any }); 
        },
    });
};

export const useUpdateAuto = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateAuto,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['autos'] });
            queryClient.setQueryData(['autos', updated.at_id], updated);
            // Перенаправлення на список
            navigate({ to: '/autos/' as any }); 
        },
    });
};

export const useDeleteAuto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAuto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autos'] });
        },
    });
};