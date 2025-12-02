// src/features/clients/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios'; 
import type { Client } from './types';
// 👇 ПРИБИРАЄМО: import { CreateClientDto, UpdateClientDto } from './schema';

// ==== Утиліти типів, що відповідають твоїм DTO ====
// Omit<Client, 'c_id'> відповідає тому, що потрібно для створення (CreateClientDto)
type ClientCreateData = Omit<Client, 'c_id'>; 
// Partial<Omit<Client, 'c_id'>> відповідає тому, що потрібно для оновлення (UpdateClientDto)
type ClientUpdateData = Partial<Omit<Client, 'c_id'>>;

// ==== API функції ====

const getClients = async (): Promise<Array<Client>> => {
    const response = await apiClient.get('/clients');
    return response.data.data; 
};

const getClientById = async (id: number): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data.data;
};

// 👇 Використовуємо ClientCreateData замість CreateClientDto
const createClient = async (data: ClientCreateData): Promise<Client> => {
    const response = await apiClient.post('/clients', data);
    return response.data.data;
};

const updateClient = async ({
    id,
    // 👇 Використовуємо ClientUpdateData замість UpdateClientDto
    data,
}: {
    id: number;
    data: ClientUpdateData;
}): Promise<Client> => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data.data;
};

const deleteClient = async (id: number): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
};

// ==== Хуки для компонентов (без змін) ====

export const useClients = () => useQuery<Array<Client>>({
    queryKey: ['clients'],
    queryFn: getClients,
});

export const useClient = (id: number) => useQuery<Client>({
    queryKey: ['clients', id],
    queryFn: () => getClientById(id),
    enabled: !!id, 
});

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createClient,
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            navigate({ to: '/clients/' as any }); 
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateClient,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.setQueryData(['clients', updated.c_id], updated);
            navigate({ to: '/clients/' as any }); 
        },
    });
};

export const useDeleteClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};