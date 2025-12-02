import { createFileRoute } from "@tanstack/react-router";
import { ShiftCreatePage } from '@/features/shifts/pages/ShiftCreatePage';

// Визначаємо маршрут /shifts/create
export const Route = createFileRoute('/shifts/create')({
  component: ShiftCreatePage,
});