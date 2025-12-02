import { createFileRoute } from '@tanstack/react-router';
import { WorkspacePage } from '@/features/workspace/pages/WorkspacePage';

// Визначаємо маршрут /workspace
export const Route = createFileRoute('/workspace')({
  component: WorkspacePage,
});