import { createFileRoute } from '@tanstack/react-router';
import { CheckoutsPage } from '@/features/checkouts/pages/CheckoutsPage'; 

// Визначаємо маршрут /checkouts/
export const Route = createFileRoute('/checkouts/')({
  component: CheckoutsPage,
});