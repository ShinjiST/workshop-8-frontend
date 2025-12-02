import { createFileRoute } from "@tanstack/react-router";
import { ParkingSpaceShowPage } from "@/features/parkingspaces/pages/ParkingSpaceShowPage";

export const Route = createFileRoute("/parkingspaces/show/$ps_id")({
  component: ParkingSpaceShowPage,
});
