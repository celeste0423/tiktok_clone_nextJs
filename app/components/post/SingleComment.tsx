import { useUser } from "@/app/context/user";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import useDeleteComment from "@/app/hooks/useDeleteComment";
import { useCommentStore } from "@/app/stores/comment";
import { SingleCommentCompTypes } from "@/app/types";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";

export default function SingleComments({
  comment,
  params,
}: SingleCommentCompTypes) {
  const contextUser = useUser();
  let { setCommentsByPost } = useCommentStore();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteThisComment = async () => {
    let res = confirm("Are you sure you want to delete this comment?");
    if (!res) return;

    try {
      setIsDeleting(true);
      //서버의 특정 댓글 제거
      await useDeleteComment(comment?.id);
      //지운 댓글 목록을 다운로드 => 로컬 변수에 넣음
      setCommentsByPost(params?.postId);
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      <div
        id="SingleComment"
        className="flex items-center justify-between px-8 mt-4"
      >
        <div className="flex items-center relative w-full">
          <Link href={`/profile/${comment.profile.user_id}`}>
            <img
              src={useCreateBucketUrl(comment.profile.image)}
              alt=""
              className="absolute top-0 rounded-full lg:mx-0 mx-auto"
              width="40"
            />
          </Link>
          <div className="ml-14 pt-0.5 w-full">
            <div className="text-[18px] font-semibold flex items-center justify-between">
              <span className="flex items-center">
                {comment?.profile?.name} -
                <span className="text-[12px] text-gray-600 font-light ml-1">
                  {moment(comment?.created_at).calendar()}
                </span>
              </span>

              {contextUser?.user?.id == comment.profile.user_id ? (
                <button
                  disabled={isDeleting}
                  onClick={() => deleteThisComment()}
                >
                  {isDeleting ? (
                    <BiLoaderCircle
                      className="animate-spin"
                      color="#E91E62"
                      size="20"
                    />
                  ) : (
                    <BsTrash3 className="cursor-pointer" size="25" />
                  )}
                </button>
              ) : null}
            </div>

            <p className="text-[15px] font-light">{comment.text}</p>
          </div>
        </div>
      </div>
    </>
  );
}
