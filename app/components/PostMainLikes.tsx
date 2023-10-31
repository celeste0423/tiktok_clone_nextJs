import { useEffect, useState } from "react";
import { Like, PostMainLikesCompTypes, Comment } from "../types";
import { useRouter } from "next/navigation";

import { AiFillHeart } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { FaCommentDots, FaShare } from "react-icons/fa";
import { useGeneralStore } from "../stores/general";
import { useUser } from "../context/user";
import useGetCommentsByPostId from "../hooks/useGetCommentsByPostId";
import useGetLikesByPostId from "../hooks/useGetLikesByPostId";
import useIsLiked from "../hooks/useIsLiked";
import useCreateLike from "../hooks/useCreateLike";
import useDeleteLike from "../hooks/useDeleteLike";

export default function PostMainLikes({ post }: PostMainLikesCompTypes) {
  let { setIsLoginOpen } = useGeneralStore();

  const router = useRouter();
  const contextUser = useUser();

  //좋아요 눌렀을 시 로딩용
  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  //좋아요를 리스트로 아이디, 사람, 포스트 이렇게 받아서 개수는 length로 출력
  const [likes, setLikes] = useState<Like[]>([]);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  useEffect(() => {
    getAllLikesByPost();
    getAllCommentsByPost();
  }, [post]);

  useEffect(() => {
    //좋아요를 눌렀거나, 유저가 바뀌었을 때
    hasUserLikedPost();
  }, [likes, contextUser]);

  const getAllCommentsByPost = async () => {
    let result = await useGetCommentsByPostId(post?.id);
    setComments(result);
  };
  const getAllLikesByPost = async () => {
    let result = await useGetLikesByPostId(post?.id);
    setLikes(result);
  };

  const hasUserLikedPost = () => {
    if (!contextUser) return;

    if (likes?.length < 1 || !contextUser?.user?.id) {
      setUserLiked(false);
      return;
    }
    let res = useIsLiked(contextUser?.user?.id, post?.id, likes);
    setUserLiked(res ? true : false);
  };

  const like = async () => {
    try {
      setHasClickedLike(true);
      await useCreateLike(contextUser?.user?.id || "", post?.id);
      await getAllLikesByPost();
      //클라 유저가 좋아요 눌렀는 지 확인
      hasUserLikedPost();
      setHasClickedLike(false);
    } catch (error) {
      alert(error);
    }
  };
  const unlike = async (id: string) => {
    try {
      setHasClickedLike(true);
      await useDeleteLike(id);
      await getAllLikesByPost();
      //클라 유저가 좋아요 눌렀는 지 확인
      hasUserLikedPost();
      setHasClickedLike(false);
    } catch (error) {
      alert(error);
    }
  };

  const likeOrUnlike = () => {
    if (!contextUser?.user) return setIsLoginOpen(true);

    let res = useIsLiked(contextUser.user.id, post?.id, likes);
    if (!res) {
      //좋아요 안누른 경우
      like();
    } else {
      likes.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser.user.id == like.user_id &&
          like.post_id == post?.id
        ) {
          unlike(like.id);
        }
      });
    }
  };

  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <>
      <div id={`PostMainLikes-${post?.id}`} className="relative mr-[75px]">
        <div className="absolute bottom-0 pl-2">
          <div className="pb-4 text-center">
            <button
              disabled={hasClickedLike}
              onClick={() => likeOrUnlike()}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
            >
              {!hasClickedLike ? (
                <AiFillHeart
                  color={likes?.length > 0 && userLiked ? "#ff2626" : ""}
                  size="25"
                />
              ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs text-gray-800 font-semibold">
              {likes?.length}
            </span>
          </div>

          <button
            onClick={() =>
              router.push(`/post/${post?.id}/${post?.profile?.user_id}`)
            }
            className="pb-4 text-center"
          >
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaCommentDots size="25" />
            </div>
            <span className="text-xs text-gray-800 font-semibold">
              {comments.length}
            </span>
          </button>

          <button className="text-center">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaShare size="25" />
            </div>
            <span className="text-xs text-gray-800 font-semibold">60</span>
          </button>
        </div>
      </div>
    </>
  );
}
