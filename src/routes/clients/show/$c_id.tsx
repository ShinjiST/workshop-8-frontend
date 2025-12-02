import { createFileRoute } from '@tanstack/react-router';
import { ClientShowPage } from '@/features/clients/pages/ClientShowPage'; 

// Визначаємо маршрут /clients/show/$c_id
export const Route = createFileRoute('/clients/show/$c_id')({
  component: ClientShowPage,
});