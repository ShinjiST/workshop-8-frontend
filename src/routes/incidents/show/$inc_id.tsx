import { createFileRoute } from '@tanstack/react-router';
import { IncidentShowPage } from '@/features/incidents/pages/IncidentShowPage'; 

// Визначаємо маршрут /incidents/show/$inc_id
export const Route = createFileRoute('/incidents/show/$inc_id')({
  component: IncidentShowPage,
});