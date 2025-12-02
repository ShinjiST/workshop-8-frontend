import { createFileRoute } from '@tanstack/react-router';
import { ShiftsPage } from '@/features/shifts/pages/ShiftsPage'; 

// Визначаємо маршрут /shifts/
export const Route = createFileRoute('/shifts/')({
  component: ShiftsPage,
});