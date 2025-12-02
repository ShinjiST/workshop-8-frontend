import { createFileRoute } from '@tanstack/react-router';
// Припускаємо, що ти назвеш компонент EmployeesPage
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage'; 

// Визначаємо маршрут /employees/
export const Route = createFileRoute('/employees/')({
  component: EmployeesPage,
});