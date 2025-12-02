import { createFileRoute } from '@tanstack/react-router';
import { MaintenanceShowPage } from '@/features/maintenances/pages/MaintenanceShowPage'; 

// Визначаємо маршрут /maintenances/show/$m_id
export const Route = createFileRoute('/maintenances/show/$m_id')({
  component: MaintenanceShowPage,
});