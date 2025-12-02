import { createFileRoute } from "@tanstack/react-router";
import { ClientCreatePage } from '@/features/clients/pages/ClientCreatePage';

// Визначаємо маршрут /clients/create
export const Route = createFileRoute('/clients/create')({
  component: ClientCreatePage,
});