import { createFileRoute } from "@tanstack/react-router";
import { AgreementCreatePage } from '@/features/agreements/pages/AgreementCreatePage';

// Визначаємо маршрут /agreements/create
export const Route = createFileRoute('/agreements/create')({
  component: AgreementCreatePage,
});