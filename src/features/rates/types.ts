// src/features/rates/types.ts

import type { Agreement } from '../agreements/types'; // Залишаємо коментар для строгої типізації

export interface Rate {
    r_id: number;
    r_auto_type: string; // Тип авто ("Легкове", "Вантажне", ...)
    r_parking_space_type: string; // Тип паркомісця
    r_price_per_day: number; // Ціна за добу (Numeric 10, 2)
    r_date: string; // Дата створення/активності (date)
    
    // Зв'язок (як у ParkingSpace)
    agreements?: Array<Agreement>; 
}
