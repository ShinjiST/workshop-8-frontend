import { createFileRoute } from "@tanstack/react-router";
import { ParkingZoneShowPage } from "@/features/parkingzones/pages/ParkingZoneShowPage";

export const Route = createFileRoute("/parkingzones/show/$pz_id")({
  component: ParkingZoneShowPage,
});
