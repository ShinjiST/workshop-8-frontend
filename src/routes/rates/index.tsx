import { createFileRoute } from '@tanstack/react-router';
// Припускаємо, що ти назвеш компонент RatesPage
import { RatesPage } from '@/features/rates/pages/RatesPage'; 

// Визначаємо маршрут /rates/
export const Route = createFileRoute('/rates/')({
  component: RatesPage,
});