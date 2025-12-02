// src/routes/register.tsx
import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/features/pages/RegisterPage';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});