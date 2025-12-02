import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceCreatePage } from '@/features/maintenances/pages/MaintenanceCreatePage';

// Визначаємо маршрут /maintenances/create
export const Route = createFileRoute('/maintenances/create')({
  component: MaintenanceCreatePage,
});