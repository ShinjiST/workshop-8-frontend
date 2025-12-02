// src/features/rates/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Rate } from './types';

// ==== Утиліти типів ====
// Виключаємо r_id та зв'язки при створенні/оновленні
type RateCreateData = Omit<Rate, 'r_id' | 'agreements'>; 
type RateUpdateData = Partial<Omit<Rate, 'r_id' | 'agreements'>>;

// ==== API функції ====

const getRates = async (): Promise<Array<Rate>> => {
    const response = await apiClient.get('/rates');
    return response.data.data; 
};

const getRateById = async (id: number): Promise<Rate> => {
    const response = await apiClient.get(`/rates/${id}`);
    return response.data.data;
};

const createRate = async (data: RateCreateData): Promise<Rate> => {
    const response = await apiClient.post('/rates', data);
    return response.data.data;
};

const updateRate = async ({
    id,
    data,
}: {
    id: number;
    data: RateUpdateData; 
}): Promise<Rate> => {
    const response = await apiClient.put(`/rates/${id}`, data);
    return response.data.data;
};

const deleteRate = async (id: number): Promise<void> => {
    await apiClient.delete(`/rates/${id}`);
};

// ==== Хуки для компонентов ====

export const useRates = () => useQuery<Array<Rate>>({
    queryKey: ['rates'],
    queryFn: getRates,
});

export const useRate = (id: number) => useQuery<Rate>({
    queryKey: ['rates', id],
    queryFn: () => getRateById(id),
    enabled: !!id, 
});

export const useCreateRate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rates'] });
            // Перенаправлення на список
            navigate({ to: '/rates/' as any }); 
        },
    });
};

export const useUpdateRate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateRate,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['rates'] });
            queryClient.setQueryData(['rates', updated.r_id], updated);
            // Перенаправлення на список
            navigate({ to: '/rates/' as any }); 
        },
    });
};

export const useDeleteRate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rates'] });
        },
    });
};