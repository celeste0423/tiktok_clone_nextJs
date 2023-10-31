import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import useGetProfileByUserId from "../hooks/useGetProfileByUserId";
import { Post, PostWithProfile, Profile } from "../types";
import useGetAllPosts from "../hooks/useGetAllPosts";
import useGetPostsByUser from "../hooks/useGetPostsByUser";
import useGetPostById from "../hooks/useGetPostById";

interface PostStore {
  allPosts: PostWithProfile[];
  postsByUser: Post[];
  postById: PostWithProfile | null;
  setAllPosts: () => void;
  setPostsByUser: (userId: string) => void;
  setPostById: (postId: string) => void;
}

export const usePostStore = create<PostStore>()(
  devtools(
    //persist의 콜백함수로는 주로 set함수 사용함, state의 업데이트는 set을 이용하는 게 좋음
    persist(
      (set) => ({
        allPosts: [],
        postsByUser: [],
        postById: null,

        setAllPosts: async () => {
          const result = await useGetAllPosts();
          set({ allPosts: result });
        },
        setPostsByUser: async (userId: string) => {
          const result = await useGetPostsByUser(userId);
          set({ postsByUser: result });
        },
        setPostById: async (postId: string) => {
          const result = await useGetPostById(postId);
          set({ postById: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
