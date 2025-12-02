import { createFileRoute } from "@tanstack/react-router";
import { EmployeeCreatePage } from '@/features/employees/pages/EmployeeCreatePage';

// Визначаємо маршрут /employees/create
export const Route = createFileRoute('/employees/create')({
  component: EmployeeCreatePage,
});