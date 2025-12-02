import { createFileRoute } from "@tanstack/react-router";
import { ParkingSpaceCreatePage } from '@/features/parkingspaces/pages/ParkingSpaceCreatePage';

export const Route = createFileRoute('/parkingspaces/create')({
  component: ParkingSpaceCreatePage,
});
