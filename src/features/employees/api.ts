// src/features/employees/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Employee } from './types';

// ==== Утиліти типів, що відповідають твоїй моделі ====
// Виключаємо e_id та всі зв'язки при створенні/оновленні
type EmployeeCreateData = Omit<Employee, 'e_id' | 'workSchedules' | 'checkouts' | 'incidents' | 'maintenances' | 'agreements'>; 
type EmployeeUpdateData = Partial<Omit<Employee, 'e_id' | 'workSchedules' | 'checkouts' | 'incidents' | 'maintenances' | 'agreements'>>;

// ==== API функції ====

const getEmployees = async (): Promise<Array<Employee>> => {
    const response = await apiClient.get('/employees');
    return response.data.data; 
};

const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data.data;
};

const createEmployee = async (data: EmployeeCreateData): Promise<Employee> => {
    const response = await apiClient.post('/employees', data);
    return response.data.data;
};

const updateEmployee = async ({
    id,
    data,
}: {
    id: number;
    data: EmployeeUpdateData; 
}): Promise<Employee> => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data.data;
};

const deleteEmployee = async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
};

// ==== Хуки для компонентов ====

export const useEmployees = () => useQuery<Array<Employee>>({
    queryKey: ['employees'],
    queryFn: getEmployees,
});

export const useEmployee = (id: number) => useQuery<Employee>({
    queryKey: ['employees', id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id, 
});

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            // Перенаправлення на список
            navigate({ to: '/employees/' as any }); 
        },
    });
};

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateEmployee,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            queryClient.setQueryData(['employees', updated.e_id], updated);
            // Перенаправлення на список
            navigate({ to: '/employees/' as any }); 
        },
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};