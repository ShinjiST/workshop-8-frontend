import { createFileRoute } from "@tanstack/react-router";
import { CheckoutCreatePage } from '@/features/checkouts/pages/CheckoutCreatePage';

// Визначаємо маршрут /checkouts/create
export const Route = createFileRoute('/checkouts/create')({
  component: CheckoutCreatePage,
});