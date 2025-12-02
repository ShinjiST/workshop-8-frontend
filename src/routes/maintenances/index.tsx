import { createFileRoute } from '@tanstack/react-router';
import { MaintenancesPage } from '@/features/maintenances/pages/MaintenancesPage'; 

// Визначаємо маршрут /maintenances/
export const Route = createFileRoute('/maintenances/')({
  component: MaintenancesPage,
});