import { createFileRoute } from "@tanstack/react-router";
import { ParkingSpaceEditPage } from "@/features/parkingspaces/pages/ParkingSpaceEditPage";

export const Route = createFileRoute("/parkingspaces/edit/$ps_id")({
  component: ParkingSpaceEditPage,
});
