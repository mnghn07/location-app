import * as Location from "expo-location";
import { DISTANCE_THRESHOLD, LOCATION_TASK_NAME } from "@/utils/constants";

export const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        showsBackgroundLocationIndicator: true
      });
    }
  }
};

export function isMoving(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
) {
  const R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLong = deg2rad(long2 - long1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d < DISTANCE_THRESHOLD;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
