import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Agreement } from './types';
import type { AgreementFormValues } from './schema';

// ==== API функції ====

const getAgreements = async (): Promise<Array<Agreement>> => {
  const response = await apiClient.get('/agreements');
  return response.data.data; 
};

const getAgreementById = async (id: number): Promise<Agreement> => {
  const response = await apiClient.get(`/agreements/${id}`);
  return response.data.data;
};

const createAgreement = async (data: AgreementFormValues): Promise<Agreement> => {
  const response = await apiClient.post('/agreements', data);
  return response.data.data;
};

const updateAgreement = async ({
  id,
  data,
}: {
  id: number;
  data: AgreementFormValues;
}): Promise<Agreement> => {
  const response = await apiClient.put(`/agreements/${id}`, data);
  return response.data.data;
};

const deleteAgreement = async (id: number): Promise<void> => {
  await apiClient.delete(`/agreements/${id}`);
};

// ==== Хуки для компонентів ====

export const useAgreements = () => useQuery<Array<Agreement>>({
  queryKey: ['agreements'],
  queryFn: getAgreements,
});

export const useAgreement = (id: number) => useQuery<Agreement>({
  queryKey: ['agreements', id],
  queryFn: () => getAgreementById(id),
  enabled: !!id,
});

export const useCreateAgreement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      navigate({ to: '/agreements' as any });
    },
  });
};

export const useUpdateAgreement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateAgreement,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      queryClient.setQueryData(['agreements', updated.ag_id], updated);
      navigate({ to: '/agreements' as any });
    },
  });
};

export const useDeleteAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
    },
  });
};