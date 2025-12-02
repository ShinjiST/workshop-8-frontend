// src/features/parkingspaces/types.ts

import type { ParkingZone } from '../parkingzones/types';

export interface ParkingSpace {
  ps_id: number;
  ps_number: string;
  ps_level: number;
  ps_status: string;
  ps_auto_type: string;
  pz_id: number;
  parkingZone?: ParkingZone; // необязательное поле
}
