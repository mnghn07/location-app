import { AppState } from "@/stores/models/client.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Location from "expo-location";

interface IAppState extends AppState {
  setFrequency: (frequency: number) => void;
  setNotificationPermission: (permission: Location.PermissionStatus) => void;
  setLocationSharing: () => void;
  setMode: () => void;
  setOffline: () => void;
  setPushToken: (token: string) => void;
  onHandleReceivedNotification?: (notification: any) => void;
}

const useAppStore = create<IAppState>()(
  persist(
    (set, get) => ({
      mode: "light",
      offline: false,
      locationSharing: true,
      locationFrequency: 8,
      notificationPermission: Location.PermissionStatus.UNDETERMINED,
      pushToken: "",
      setMode: () => set({ mode: get().mode === "light" ? "dark" : "light" }),
      setOffline: () => set({ offline: !get().offline }),
      setLocationSharing: () => {
        set({ locationSharing: !get().locationSharing });
        console.log("locationSharing", get().locationSharing);
      },
      setFrequency: (frequency: number) =>
        set({ locationFrequency: frequency }),
      setNotificationPermission: (permission: Location.PermissionStatus) =>
        set({ notificationPermission: permission }),
      setPushToken: (token: string) => set({ pushToken: token }),
      onHandleReceivedNotification: notification => {
        console.log("notification", notification);
        // receive notification, stop collecting location
        let timeout = setTimeout(() => {
          set({ locationSharing: false });
        }, 500);

        return () => clearTimeout(timeout);
      }
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        mode: state.mode,
        locationFrequency: state.locationFrequency
      }),
      onRehydrateStorage: state => {
        console.log("hydration starts");

        // optional
        return (_state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
          }
        };
      }
    }
  )
);

export default useAppStore;
