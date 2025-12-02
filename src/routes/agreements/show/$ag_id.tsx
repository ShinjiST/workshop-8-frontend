import { createFileRoute } from '@tanstack/react-router';
import { AgreementShowPage } from '@/features/agreements/pages/AgreementShowPage'; 

// Визначаємо маршрут /agreements/show/$ag_id
export const Route = createFileRoute('/agreements/show/$ag_id')({
  component: AgreementShowPage,
});