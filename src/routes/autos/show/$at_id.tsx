import { createFileRoute } from '@tanstack/react-router';
import { AutoShowPage } from '@/features/autos/pages/AutoShowPage'; 

// Визначаємо маршрут /autos/show/$at_id
export const Route = createFileRoute('/autos/show/$at_id')({
  component: AutoShowPage,
});