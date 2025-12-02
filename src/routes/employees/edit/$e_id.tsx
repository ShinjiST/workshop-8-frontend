import { createFileRoute } from '@tanstack/react-router';
import { EmployeeEditPage } from '@/features/employees/pages/EmployeeEditPage'; 

// Визначаємо маршрут /employees/edit/$e_id
export const Route = createFileRoute('/employees/edit/$e_id')({
  component: EmployeeEditPage,
});