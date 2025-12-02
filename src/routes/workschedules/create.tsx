import { createFileRoute } from "@tanstack/react-router";
import { WorkScheduleCreatePage } from '@/features/workschedules/pages/WorkScheduleCreatePage';

// Визначаємо маршрут /workschedules/create
export const Route = createFileRoute('/workschedules/create')({
  component: WorkScheduleCreatePage,
});