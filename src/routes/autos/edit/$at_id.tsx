import { createFileRoute } from '@tanstack/react-router';
import { AutoEditPage } from '@/features/autos/pages/AutoEditPage'; 

// Визначаємо маршрут /autos/edit/$at_id
export const Route = createFileRoute('/autos/edit/$at_id')({
  component: AutoEditPage,
});