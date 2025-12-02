import { createFileRoute } from '@tanstack/react-router';
import { IncidentsPage } from '@/features/incidents/pages/IncidentsPage'; 

// Визначаємо маршрут /incidents/
export const Route = createFileRoute('/incidents/')({
  component: IncidentsPage,
});