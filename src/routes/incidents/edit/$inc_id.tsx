import { createFileRoute } from '@tanstack/react-router';
import { IncidentEditPage } from '@/features/incidents/pages/IncidentEditPage'; 

// Визначаємо маршрут /incidents/edit/$inc_id
export const Route = createFileRoute('/incidents/edit/$inc_id')({
  component: IncidentEditPage,
});