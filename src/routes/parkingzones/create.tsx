import { createFileRoute } from "@tanstack/react-router";
import { ParkingZoneCreatePage } from '@/features/parkingzones/pages/ParkingZoneCreatePage';

export const Route = createFileRoute('/parkingzones/create')({
  component: ParkingZoneCreatePage,
});
