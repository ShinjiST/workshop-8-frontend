// src/routes/parkingzones.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ParkingZonesPage } from '@/features/parkingzones/pages/ParkingZonesPage';

export const Route = createFileRoute('/parkingzones/')({
  component: ParkingZonesPage,
});
