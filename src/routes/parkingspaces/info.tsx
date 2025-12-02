import { createFileRoute } from "@tanstack/react-router";
import { ParkingSpaceInfoPage } from "@/features/parkingspaces/pages/ParkingSpaceInfoPage";

export const Route = createFileRoute("/parkingspaces/info")({
  component: ParkingSpaceInfoPage,
});
