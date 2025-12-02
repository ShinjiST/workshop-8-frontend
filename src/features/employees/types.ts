// src/features/employees/types.ts

import type { WorkSchedule } from '../workschedules/types'; 
import type { Maintenance } from '../maintenances/types';
import type { Agreement } from '../agreements/types';
import type { Checkout } from '../checkouts/types';
import type { Incident } from '../incidents/types';

export interface Employee {
    e_id: number;
    e_full_name: string;
    e_phone_number: string; // 10
    e_backup_phone_number: string; // 10
    e_email: string; // 255
    e_hire_date: string; // date
    e_position: string; // 30
    e_salary: number; // 10000 <= salary <= 40000
    e_status: string; // 100

  // Зв'язки (Relation) - використовуються невизначені типи
    workSchedules?: Array<WorkSchedule>;
    checkouts?: Array<Checkout>;
    incidents?: Array<Incident>;
    maintenances?: Array<Maintenance>;
    agreements?: Array<Agreement>;
}