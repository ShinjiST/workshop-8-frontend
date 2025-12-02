// src/features/incidents/types.ts

import type { Employee } from '../employees/types';
import type { ParkingSpace } from '../parkingspaces/types';

export interface Incident {
  inc_id: number;
  e_id: number;
  ps_id: number;
  inc_date: string; // ISO рядок дати (Date)
  inc_type: string;
  inc_description: string;
  inc_status: string;

  // Вкладені сутності (опціональні, бо бек може їх не завжди віддавати)
  employee?: Employee;
  parkingSpace?: ParkingSpace;
}