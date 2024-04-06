import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserLocation } from "../models/client.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LocationsState {
  locations: UserLocation[];
  locationId: number;
  setLocationId: (id: number) => void;

  addLocation: (location: UserLocation) => void;
  removeLocation: (id: string) => void;
  updateLocation: (location: UserLocation) => void;
  removeAllLocations: () => void;
}

const useLocationStore = create<LocationsState>()(
  persist(
    (set, get) => ({
      locations: [],
      locationId: 0,
      setLocationId: (id: number) => set(() => ({ locationId: id })),
      addLocation: (location: UserLocation) => {
        set(() => ({ locations: [location, ...get().locations] }));
      },
      removeLocation: (id: string) =>
        set(() => ({
          locations: get().locations.filter(location => location.id !== id)
        })),
      updateLocation: (location: UserLocation) =>
        set(state => ({
          locations: state.locations.map(l =>
            l.id === location.id ? location : l
          )
        })),
      removeAllLocations: () => set(() => ({ locations: [] }))
    }),
    {
      name: "locations",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useLocationStore;
