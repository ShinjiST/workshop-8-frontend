import { createFileRoute } from '@tanstack/react-router';
import { CheckoutShowPage } from '@/features/checkouts/pages/CheckoutShowPage'; 

// Визначаємо маршрут /checkouts/show/$ch_id
export const Route = createFileRoute('/checkouts/show/$ch_id')({
  component: CheckoutShowPage,
});