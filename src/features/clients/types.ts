// src/features/clients/types.ts

// Примітка: Інтерфейс Agreement не визначено, але його можна додати пізніше,
// якщо він знадобиться у фронтенді.
import type { Agreement } from '../agreements/types'; 

export interface Client {
    c_id: number;
    c_full_name: string;
    c_phone_number: string; // 10 символів
    c_backup_phone_number: string; // 10 символів
    c_email: string; // до 255 символів
    agreements?: Array<Agreement>; // Якщо потрібно відображати договори
}