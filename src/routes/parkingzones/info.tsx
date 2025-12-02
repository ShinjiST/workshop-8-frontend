import { createFileRoute } from "@tanstack/react-router";
import { ParkingZoneInfoPage } from "@/features/parkingzones/pages/ParkingZoneInfoPage";

export const Route = createFileRoute("/parkingzones/info")({
  component: ParkingZoneInfoPage,
});
