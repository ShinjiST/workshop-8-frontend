// src/features/autos/types.ts

// 💡 Примітка: Цей імпорт поки що не працюватиме, доки ви не створите '../agreements/types'
import type { Agreement } from '../agreements/types'; 

export interface Auto {
    at_id: number;
    at_license_plate: string;
    at_brand: string;
    at_model: string;
    at_color: string;
    at_type: string;
    
    // 👇 ВИПРАВЛЕНО: Використовуємо невизначений тип Agreement[], 
    // як у прикладі ParkingSpace з ParkingZone. Це викличе помилку, доки не буде створено Agreement.
    agreements?: Array<Agreement>; 
}