import { createFileRoute } from '@tanstack/react-router';
import { EmployeeShowPage } from '@/features/employees/pages/EmployeeShowPage'; 

// Визначаємо маршрут /employees/show/$e_id
export const Route = createFileRoute('/employees/show/$e_id')({
  component: EmployeeShowPage,
});