import { createFileRoute } from '@tanstack/react-router';
// Припустимо, що ти розмістиш ClientEditPage за межами папки routes
import { ClientEditPage } from '@/features/clients/pages/ClientEditPage'; 

// Визначаємо маршрут /clients/edit/$c_id
export const Route = createFileRoute('/clients/edit/$c_id')({
  component: ClientEditPage,
});