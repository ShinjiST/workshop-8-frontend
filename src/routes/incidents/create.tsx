import { createFileRoute } from "@tanstack/react-router";
import { IncidentCreatePage } from '@/features/incidents/pages/IncidentCreatePage';

// Визначаємо маршрут /incidents/create
export const Route = createFileRoute('/incidents/create')({
  component: IncidentCreatePage,
});