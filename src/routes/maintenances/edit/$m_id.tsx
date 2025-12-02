import { createFileRoute } from '@tanstack/react-router';
import { MaintenanceEditPage } from '@/features/maintenances/pages/MaintenanceEditPage'; 

// Визначаємо маршрут /maintenances/edit/$m_id
export const Route = createFileRoute('/maintenances/edit/$m_id')({
  component: MaintenanceEditPage,
});