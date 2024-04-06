import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TimerState } from "../models/client.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { schedulePushNotification } from "@/utils/notifications";

interface ITimerState extends TimerState {
  setTimer?: (timer: number) => void;
  startTimer: (callback?: () => void) => void;
  stopTimer: () => void;
}

const useTimerStore = create<ITimerState>()(
  persist(
    (set, get) => ({
      intervalId: 0,
      isRunning: false,
      duration: 0,
      setTimer: number => set({ duration: number }),
      startTimer: async callback => {
        if (get().isRunning) {
          if (get().duration === 60) {
            console.log("timer finished");
            set({ duration: 0, intervalId: 0, isRunning: false });
            await schedulePushNotification();
            return;
          }
          return;
        }

        const id = setInterval(() => {
          console.log("timer running", get().duration);
          set({ duration: get().duration + 1 });
        }, 1000);
        set({ intervalId: id, isRunning: true });
        if (callback) callback();
      },

      stopTimer: () => {
        clearInterval(get().intervalId);
        set({ isRunning: false });
      }
    }),
    {
      name: "timer-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useTimerStore;
