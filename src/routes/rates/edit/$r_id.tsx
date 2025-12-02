import { createFileRoute } from '@tanstack/react-router';
import { RateEditPage } from '@/features/rates/pages/RateEditPage'; 

// Визначаємо маршрут /rates/edit/$r_id
export const Route = createFileRoute('/rates/edit/$r_id')({
  component: RateEditPage,
});