import { createFileRoute } from '@tanstack/react-router';
import { CheckoutEditPage } from '@/features/checkouts/pages/CheckoutEditPage'; 

// Визначаємо маршрут /checkouts/edit/$ch_id
export const Route = createFileRoute('/checkouts/edit/$ch_id')({
  component: CheckoutEditPage,
});