import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Checkout } from './types';
import type { CheckoutFormValues } from './schema';

// ==== API функції ====

const getCheckouts = async (): Promise<Array<Checkout>> => {
  const response = await apiClient.get('/checkouts');
  return response.data.data; 
};

const getCheckoutById = async (id: number): Promise<Checkout> => {
  const response = await apiClient.get(`/checkouts/${id}`);
  return response.data.data;
};

const createCheckout = async (data: CheckoutFormValues): Promise<Checkout> => {
  const response = await apiClient.post('/checkouts', data);
  return response.data.data;
};

const updateCheckout = async ({
  id,
  data,
}: {
  id: number;
  data: CheckoutFormValues;
}): Promise<Checkout> => {
  const response = await apiClient.put(`/checkouts/${id}`, data);
  return response.data.data;
};

const deleteCheckout = async (id: number): Promise<void> => {
  await apiClient.delete(`/checkouts/${id}`);
};

// ==== Хуки для компонентів ====

export const useCheckouts = () => useQuery<Array<Checkout>>({
  queryKey: ['checkouts'],
  queryFn: getCheckouts,
});

export const useCheckout = (id: number) => useQuery<Checkout>({
  queryKey: ['checkouts', id],
  queryFn: () => getCheckoutById(id),
  enabled: !!id,
});

export const useCreateCheckout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkouts'] });
      navigate({ to: '/checkouts' as any });
    },
  });
};

export const useUpdateCheckout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateCheckout,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['checkouts'] });
      queryClient.setQueryData(['checkouts', updated.ch_id], updated);
      navigate({ to: '/checkouts' as any });
    },
  });
};

export const useDeleteCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkouts'] });
    },
  });
};