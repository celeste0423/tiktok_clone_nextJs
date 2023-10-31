import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CommentWithProfile, Like } from "../types";
import useGetCommentsByPostId from "../hooks/useGetCommentsByPostId";

interface CommentStore {
  commentsByPost: CommentWithProfile[];
  setCommentsByPost: (postId: string) => void;
}

export const useCommentStore = create<CommentStore>()(
  devtools(
    //persist의 콜백함수로는 주로 set함수 사용함, state의 업데이트는 set을 이용하는 게 좋음
    persist(
      (set) => ({
        commentsByPost: [],

        setCommentsByPost: async (postId: string) => {
          const result = await useGetCommentsByPostId(postId);
          set({ commentsByPost: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
