import { createFileRoute } from "@tanstack/react-router";
import { ParkingZoneEditPage } from "@/features/parkingzones/pages/ParkingZoneEditPage";

export const Route = createFileRoute("/parkingzones/edit/$pz_id")({
  component: ParkingZoneEditPage,
});
