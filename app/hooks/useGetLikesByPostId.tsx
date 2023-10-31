import { Query, database } from "@/libs/AppWriteClient";

const useGetLikesByPostId = async (postId: string) => {
  try {
    //response에 쿼리를 통해 리스트 전체를 받음
    const response = await database.listDocuments(
      String(process.env.NEXT_PUBLIC_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE),
      [Query.equal("post_id", postId)]
    );
    const documents = response.documents;
    //result 좋아요들이 들어있는 배열로 반환
    const result = documents.map((doc) => {
      return {
        id: doc?.$id,
        user_id: doc?.user_id,
        post_id: doc?.post_id,
      };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export default useGetLikesByPostId;
