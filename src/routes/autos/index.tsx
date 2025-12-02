import { createFileRoute } from '@tanstack/react-router';
// 💡 ВИПРАВЛЕНО: Імпортуємо компонент як AutosPage
import { AutosPage } from '@/features/autos/pages/AutosPage'; 

// Визначаємо маршрут /autos/
export const Route = createFileRoute('/autos/')({
  component: AutosPage,
});