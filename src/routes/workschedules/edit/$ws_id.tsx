import { createFileRoute } from '@tanstack/react-router';
import { WorkScheduleEditPage } from '@/features/workschedules/pages/WorkScheduleEditPage'; 

// Визначаємо маршрут /workschedules/edit/$ws_id
export const Route = createFileRoute('/workschedules/edit/$ws_id')({
  component: WorkScheduleEditPage,
});