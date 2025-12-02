// src/features/parkingzones/types.ts
import type { ParkingSpace } from '../parkingspaces/types';

export interface ParkingZone {
  pz_id: number;
  pz_name: string;
  pz_capacity: number;
  parkingSpaces?: Array<ParkingSpace>;
}
