"use client";

import { useEffect } from "react";
import ClientOnly from "./components/ClientOnly";
import PostMain from "./components/PostMain";
import MainLayout from "./layouts/MainLayout";
import { usePostStore } from "./stores/post";

export default function Home() {
  let { allPosts, setAllPosts } = usePostStore();

  useEffect(() => {
    setAllPosts();
  }, []);

  return (
    <>
      {/* MainLayout에 사이드nav, 탑nav있음 */}
      <MainLayout>
        <div className="mt-[80px] w-[calc(100%-90px)] max-w-[690px] ml-auto">
          <ClientOnly>
            {allPosts.map((post, index) => (
              <PostMain post={post} key={index} />
            ))}
          </ClientOnly>
        </div>
      </MainLayout>
    </>
  );
}
