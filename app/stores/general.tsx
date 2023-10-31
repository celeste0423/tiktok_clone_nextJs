import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { RandomUsers } from "../types";
import useGetRandomUsers from "../hooks/useGetRandomUsers";

interface GeneralStore {
  //오프라인에 저장할 것들
  isLoginOpen: boolean;
  isEditProfileOpen: boolean;
  randomUsers: RandomUsers[];
  setIsLoginOpen: (val: boolean) => void; //boolean을 변수로 가지는 함수
  setIsEditProfileOpen: (val: boolean) => void;
  setRandomUsers: () => void;
}

export const useGeneralStore = create<GeneralStore>()(
  devtools(
    //devtools => 개발자 툴 사용 가능해짐
    persist(
      //persist => 브라우저 로컬 스토리지에 저장
      (set) => ({
        isLoginOpen: false,
        isEditProfileOpen: false,
        randomUsers: [],

        setIsLoginOpen: (val: boolean) => set({ isLoginOpen: val }),
        setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }),
        setRandomUsers: async () => {
          const result = await useGetRandomUsers();
          set({ randomUsers: result });
        },
      }),
      {
        name: "stored",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
