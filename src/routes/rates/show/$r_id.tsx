import { createFileRoute } from '@tanstack/react-router';
import { RateShowPage } from '@/features/rates/pages/RateShowPage'; 

// Визначаємо маршрут /rates/show/$r_id
export const Route = createFileRoute('/rates/show/$r_id')({
  component: RateShowPage,
});