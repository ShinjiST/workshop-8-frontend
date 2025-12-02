import { createFileRoute } from "@tanstack/react-router";
import { AutoCreatePage } from '@/features/autos/pages/AutoCreatePage';

// Визначаємо маршрут /autos/create
export const Route = createFileRoute('/autos/create')({
  component: AutoCreatePage,
});