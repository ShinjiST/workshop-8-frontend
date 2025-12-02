import { createFileRoute } from '@tanstack/react-router';
import { AgreementEditPage } from '@/features/agreements/pages/AgreementEditPage'; 

// Визначаємо маршрут /agreements/edit/$ag_id
export const Route = createFileRoute('/agreements/edit/$ag_id')({
  component: AgreementEditPage,
});