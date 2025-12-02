import { createFileRoute } from '@tanstack/react-router';
import { ShiftEditPage } from '@/features/shifts/pages/ShiftEditPage'; 

// Визначаємо маршрут /shifts/edit/$sh_id
export const Route = createFileRoute('/shifts/edit/$sh_id')({
  component: ShiftEditPage,
});