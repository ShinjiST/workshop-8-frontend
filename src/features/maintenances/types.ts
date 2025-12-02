import type { Employee } from '../employees/types';
import type { ParkingSpace } from '../parkingspaces/types';

export interface Maintenance {
  m_id: number;
  ps_id: number;
  e_id: number;
  m_date: string;       // ISO Date string
  m_description: string;
  m_cost: number | null; // Дозволяємо null, бо в базі nullable: true
  
  // Вкладені сутності (optional, бо приходять не завжди, а лише при join)
  parkingSpace?: ParkingSpace;
  employee?: Employee;
}