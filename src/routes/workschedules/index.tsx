import { createFileRoute } from '@tanstack/react-router';
import { WorkSchedulesPage } from '@/features/workschedules/pages/WorkSchedulesPage'; 

// Визначаємо маршрут /workschedules/
export const Route = createFileRoute('/workschedules/')({
  component: WorkSchedulesPage,
});