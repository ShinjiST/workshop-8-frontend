import { createFileRoute } from '@tanstack/react-router';
import { ShiftShowPage } from '@/features/shifts/pages/ShiftShowPage'; 

// Визначаємо маршрут /shifts/show/$sh_id
export const Route = createFileRoute('/shifts/show/$sh_id')({
  component: ShiftShowPage,
});