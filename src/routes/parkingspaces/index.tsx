import { createFileRoute } from '@tanstack/react-router';
import { ParkingSpacesPage } from '@/features/parkingspaces/pages/ParkingSpacesPage';

export const Route = createFileRoute('/parkingspaces/')({
  component: ParkingSpacesPage,
});
