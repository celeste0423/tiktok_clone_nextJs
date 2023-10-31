import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Like } from "../types";
import useGetLikesByPostId from "../hooks/useGetLikesByPostId";

interface LikeStore {
  likesByPost: Like[];
  setLikesByPost: (postId: string) => void;
}

export const useLikeStore = create<LikeStore>()(
  devtools(
    //persist의 콜백함수로는 주로 set함수 사용함, state의 업데이트는 set을 이용하는 게 좋음
    persist(
      (set) => ({
        likesByPost: [],

        setLikesByPost: async (postId: string) => {
          const result = await useGetLikesByPostId(postId);
          set({ likesByPost: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
