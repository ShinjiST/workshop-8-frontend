// src/features/shifts/types.ts

// Якщо тобі знадобиться WorkSchedule, розкоментуй імпорт
import type { WorkSchedule } from '../workschedules/types';

export interface Shift {
  sh_id: number;
  sh_name: string;      // Наприклад: "Ранкова"
  sh_start_time: string; // Наприклад: "08:00"
  sh_end_time: string;   // Наприклад: "16:00"
  sh_status: string;     // Наприклад: "active"
  
  workSchedules?: Array<WorkSchedule>; // Поки що опціонально, якщо потрібно буде виводити вкладені дані
}