import * as Location from "expo-location";
export interface AppState {
  mode: "light" | "dark";
  offline: boolean;
  locationSharing: boolean;
  locationFrequency: number;
  notificationPermission: Location.PermissionStatus;
  pushToken: string;
}

export type UserLocation = {
  id: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  name?: string;
  // if the location is the same, we will mark the id as duplicate.
  // unique one will have isDuplicate = false and earliest timestamp
  isDuplicate?: boolean;
};

export type TimerState = {
  intervalId: NodeJS.Timeout | number;
  isRunning: boolean;
  duration: number;
};
