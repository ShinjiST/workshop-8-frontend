// src/features/workschedules/types.ts

// Імпортуємо типи пов'язаних сутностей (якщо вони вже створені)
import type { Shift } from '../shifts/types';
// Припускаємо, що тип Employee існує. Якщо ні - поки закоментуй або використовуй any
import type { Employee } from '../employees/types'; 

export interface WorkSchedule {
  ws_id: number;
  sh_id: number;
  e_id: number;
  ws_date: string; // Рядок дати, наприклад "2023-10-25"

  // Приєднані сутності (можуть бути optional, якщо бек не завжди їх віддає)
  shift?: Shift;
  employee?: Employee;
}