import { createFileRoute } from "@tanstack/react-router";
import { RateCreatePage } from '@/features/rates/pages/RateCreatePage';

// Визначаємо маршрут /rates/create
export const Route = createFileRoute('/rates/create')({
  component: RateCreatePage,
});