import { createFileRoute } from '@tanstack/react-router';
import { AgreementsPage } from '@/features/agreements/pages/AgreementsPage'; 

// Визначаємо маршрут /agreements/
export const Route = createFileRoute('/agreements/')({
  component: AgreementsPage,
});