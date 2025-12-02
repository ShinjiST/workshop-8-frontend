import type { Client } from '../clients/types';
import type { Auto } from '../autos/types';
import type { Rate } from '../rates/types';
import type { ParkingSpace } from '../parkingspaces/types';
import type { Employee } from '../employees/types';
// Якщо тип Checkout ще не створений, можна поки використати any або закоментувати
// import { Checkout } from '../checkouts/types'; 

export interface Agreement {
  ag_id: number;
  c_id: number;
  at_id: number;
  r_id: number;
  ps_id: number;
  e_id: number;
  ag_date: string;          // ISO Date string (YYYY-MM-DD)
  ag_duration_days: number;
  a_total: number;
  a_status: string;         // 'активний' | 'завершений'

  // Вкладені сутності (optional)
  client?: Client;
  auto?: Auto;
  rate?: Rate;
  parkingSpace?: ParkingSpace;
  employee?: Employee;
  checkout?: any; // Checkout;
}