"use client";

import { useEffect } from "react";
import { PostMainCompTypes } from "../types";
import Link from "next/link";

import { ImMusic } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import PostMainLikes from "./PostMainLikes";
import useCreateBucketUrl from "../hooks/useCreateBucketUrl";

export default function PostMain({ post }: PostMainCompTypes) {
  // 페이지 렌더 시 자동 실행되는 함수
  useEffect(() => {
    //document.getElementById => 해당 문서내에서 아이디를 토대로 렌더 요소 찾음
    const video = document.getElementById(
      `video-${post?.id}`
    ) as HTMLVideoElement;
    const postMainElement = document.getElementById(`PostMain-${post.id}`);

    if (postMainElement) {
      //new를 통해 불러옴으로써 객체를 복사해 새로 생성
      //let은 변수에 사용함
      //IntersectionObserver => 페이지 내의 움직임(주로 스크롤)감지
      let observer = new IntersectionObserver(
        (entries) => {
          //화면 내에 entries[0]이 있을 경우에는 자동 재생, 아니면 정지
          entries[0].isIntersecting ? video.play() : video.pause();
        },
        { threshold: [0.6] }
      );

      observer.observe(postMainElement);
    }
  }, []);

  return (
    <>
      <div id={`PostMain-${post.id}`} className="flex boder-b py-6">
        <div className="cursor-pointer">
          <img
            className="rounded-full max-h-[60px]"
            width="60"
            src={useCreateBucketUrl(post?.profile?.image)}
          />
        </div>

        <div className="pl-3 w-full px-4">
          <div className="flex items-center justify-between pb-0.5">
            <Link href={`/profile/${post.profile.user_id}`}>
              <span className="font-bold hover:underline cursor_pointer">
                {post.profile.name}
              </span>
            </Link>

            <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>

          <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
            {post.text}
          </p>
          <p className="text-[14px] text-gray-500 pb-0.5">
            #fun #coll #SuperAwesome
          </p>
          <p className="text-[14px] pb-0.5 flex items-center font-semibold">
            <ImMusic size="17" />
            <span className="px-1">original sound - AWESOME</span>
            <AiFillHeart size="20" />
          </p>

          <div className="mt-2.5 flex">
            <div className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
              <video
                id={`video-${post.id}`}
                loop
                controls
                muted
                className="rounded-xl object-cover mx-auto h-full"
                src={useCreateBucketUrl(post?.video_url)}
              />

              <img
                className="absolute right-2 bottom-10"
                width="90"
                src="/images/tiktok-logo-white.png"
              />
            </div>

            <PostMainLikes post={post} />
          </div>
        </div>
      </div>
    </>
  );
}
