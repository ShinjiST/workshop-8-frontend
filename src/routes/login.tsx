// src/routes/login.tsx
import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/features/pages/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});