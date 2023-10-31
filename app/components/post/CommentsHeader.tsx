"use client";

import { CommentsHeaderCompTypes } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BiLoaderCircle } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import { ImMusic } from "react-icons/im";
import ClientOnly from "../ClientOnly";
import { AiFillHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { useLikeStore } from "@/app/stores/like";
import { useCommentStore } from "@/app/stores/comment";
import { useGeneralStore } from "@/app/stores/general";
import { useUser } from "@/app/context/user";
import useIsLiked from "@/app/hooks/useIsLiked";
import useCreateLike from "@/app/hooks/useCreateLike";
import useDeleteLike from "@/app/hooks/useDeleteLike";
import useDeletePostById from "@/app/hooks/useDeletePostById";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import moment from "moment";

export default function CommentsHeader({
  post,
  params,
}: CommentsHeaderCompTypes) {
  let { likesByPost, setLikesByPost } = useLikeStore();
  let { commentsByPost, setCommentsByPost } = useCommentStore();
  let { setIsLoginOpen } = useGeneralStore();

  const contextUser = useUser();
  const router = useRouter();
  //좋아요를 누른 후 로딩중인지의 여부
  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  useEffect(() => {
    //페이지 들어오면 좋아요, 댓글 바로 업데이트
    setCommentsByPost(params?.postId);
    setLikesByPost(params?.postId);
  }, [post]);
  useEffect(() => {
    hasUserLikedPost();
  }, [likesByPost]);

  //유저가 좋아요를 눌렀는지 확인
  const hasUserLikedPost = () => {
    if (likesByPost.length < 1 || !contextUser?.user?.id) {
      setUserLiked(false);
      return;
    }
    //해당 포스트의 좋아요 중 내가 누른 좋아요가 있는 지 확인
    let res = useIsLiked(contextUser.user.id, params.postId, likesByPost);
    setUserLiked(res ? true : false);
  };

  const like = async () => {
    try {
      //좋아요 버튼 누른 후 로딩으로 변환
      setHasClickedLike(true);
      await useCreateLike(contextUser?.user?.id || "", params.postId);
      //좋아요 가져옴
      setLikesByPost(params.postId);
      setHasClickedLike(false);
    } catch (error) {
      console.log(error);
      alert(error);
      setHasClickedLike(false); // 로딩 끝
    }
  };

  const unlike = async (id: string) => {
    try {
      //좋아요 버튼 누른 후 로딩으로 변환
      setHasClickedLike(true);
      await useDeleteLike(id);
      //좋아요 가져옴
      setLikesByPost(params.postId);
      setHasClickedLike(false);
    } catch (error) {
      console.log(error);
      alert(error);
      setHasClickedLike(false); // 로딩 끝
    }
  };

  const likeOrUnlike = () => {
    if (!contextUser?.user) return setIsLoginOpen(true);

    let res = useIsLiked(contextUser.user.id, params.postId, likesByPost);
    if (!res) {
      //좋아요 안누른 경우
      like();
    } else {
      likesByPost.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser.user.id == like.user_id &&
          like.post_id == params.postId
        ) {
          unlike(like.id);
        }
      });
    }
  };

  const deletePost = async () => {
    //confirm, alert같은 건 기본적으로 있음
    let res = confirm("Are you sure you want to delete this post?");
    if (!res) return;

    setIsDeleting(true); //로딩 시작
    try {
      await useDeletePostById(params?.postId, post?.video_url);
      router.push(`/profile/${params.userId}`);
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
      alert(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center">
          <Link href={`/profile/${post?.user_id}`}>
            {post?.profile.image ? (
              <img
                src={useCreateBucketUrl(post.profile.image)}
                alt=""
                className="rounded-full lg:mx-0 mx-auto"
                width="40"
              />
            ) : (
              <div className="w-[40px] h-[40px] bg-gray-200 rounded-full" />
            )}
          </Link>

          <div className="ml-3 pt-0.5">
            <Link
              href={`/profile/${post?.user_id}`}
              className="relative z-10 text-[17px] font-semibold hover:underline"
            >
              {post?.profile.name}
            </Link>

            <div className="relative z-0 text-[13px] -mt-5 font-light">
              {post?.profile.name}
              <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5">
                .
              </span>
              <span className="font-medium">
                {/* moment => 날짜 형식 세팅 */}
                {moment(post?.created_at).calendar()}
              </span>
            </div>
          </div>
        </div>

        {contextUser?.user?.id == post?.user_id ? (
          <div>
            {isDeleting ? (
              <BiLoaderCircle className="animate-spin" size="25" />
            ) : (
              <button disabled={isDeleting} onClick={() => deletePost()}>
                <BsTrash3 className="cursor-pointer" size="25" />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <p className="px-8 mt-4 text-sm">{post?.text}</p>

      <p className="flex items-center gap-2 px-8 mt-4 text-sm font-bold">
        <ImMusic size="17" />
        orginal sound - {post?.profile.name}
      </p>

      <div className="flex items-center px-8 mt-8">
        <ClientOnly>
          <div className="pb-4 text-center flex items-center">
            <button
              disabled={hasClickedLike}
              onClick={() => likeOrUnlike()}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
            >
              {!hasClickedLike ? (
                <AiFillHeart
                  color={likesByPost.length > 0 && userLiked ? "#ff2626" : ""}
                  size="25"
                />
              ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              {likesByPost.length}
            </span>
          </div>
        </ClientOnly>

        <div className="pb-4 text-center flex items-center">
          <div className="rounded-full bg-gray-200 placeholder p-2 cursor-pointer">
            <BsChatDots size="25" />
          </div>
          <span className="text-xs pl-2 text-gray-800 font-semibold">
            {commentsByPost.length}
          </span>
        </div>
      </div>
    </>
  );
}
