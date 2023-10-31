import { database, storage } from "@/libs/AppWriteClient";
import useGetLikesByPostId from "./useGetLikesByPostId";
import useDeleteLike from "./useDeleteLike";
import useGetCommentsByPostId from "./useGetCommentsByPostId";

const useDeletePostById = async (postId: string, currentImage: string) => {
  try {
    //관련 좋아요 지우기
    const likes = await useGetLikesByPostId(postId);
    likes.forEach(async (like) => {
      await useDeleteLike(like?.id);
    });

    const comments = await useGetCommentsByPostId(postId);
    comments.forEach(async (comment) => {
      await useDeleteLike(comment?.id);
    });
    //관련 댓글들 지우기
    await database.deleteDocument(
      String(process.env.NEXT_PUBLIC_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST),
      postId
    );
    //관련 영상 지우기
    await storage.deleteFile(
      String(process.env.NEXT_PUBLIC_BUCKET_ID),
      currentImage
    );
  } catch (error) {
    throw error;
  }
};

export default useDeletePostById;
