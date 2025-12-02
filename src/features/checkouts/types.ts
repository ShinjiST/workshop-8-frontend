import type { Agreement } from '../agreements/types';
import type { Employee } from '../employees/types';

export interface Checkout {
  ch_id: number;
  ag_id: number;
  e_id: number;
  ch_time: string; // ISO Date string (Timestamp)
  ch_amount: number;
  ch_status: 'вчасно' | 'раніше' | 'пізно';

  // Вкладені сутності
  agreement?: Agreement;
  employee?: Employee;
}