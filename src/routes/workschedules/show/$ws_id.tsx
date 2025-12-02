import { createFileRoute } from '@tanstack/react-router';
import { WorkScheduleShowPage } from '@/features/workschedules/pages/WorkScheduleShowPage'; 

// Визначаємо маршрут /workschedules/show/$ws_id
export const Route = createFileRoute('/workschedules/show/$ws_id')({
  component: WorkScheduleShowPage,
});