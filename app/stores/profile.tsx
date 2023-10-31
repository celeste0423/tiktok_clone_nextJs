import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import useGetProfileByUserId from "../hooks/useGetProfileByUserId";
import { Profile } from "../types";

interface ProfileStore {
  currentProfile: Profile | null;
  setCurrentProfile: (userId: string) => void;
}

export const useProfileStore = create<ProfileStore>()(
  devtools(
    //persist의 콜백함수로는 주로 set함수 사용함, state의 업데이트는 set을 이용하는 게 좋음
    persist(
      (set) => ({
        currentProfile: null,

        setCurrentProfile: async (userId: string) => {
          const result = await useGetProfileByUserId(userId);
          //직접 설정 말고 set을 이용하게 되면 react가 상태 변경 감지 가능(감지 못하면 ui업데이트 못할수도)
          set({ currentProfile: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
