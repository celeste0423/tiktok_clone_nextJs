import { database, ID, Query } from "@/libs/AppWriteClient";
import useGetProfileByUserId from "./useGetProfileByUserId";

const useGetAllPosts = async () => {
  //모든 포스트 받아서 보기
  try {
    const response = await database.listDocuments(
      String(process.env.NEXT_PUBLIC_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST),
      [
        //$는 고유 식별자라는 의미를 줌
        Query.orderDesc("$id"),
      ]
    );
    const documents = response.documents;
    const objPromises = documents.map(async (doc) => {
      let profile = await useGetProfileByUserId(doc?.user_id);

      return {
        id: doc?.$id,
        user_id: doc?.user_id,
        video_url: doc?.video_url,
        text: doc?.text,
        created_at: doc?.created_at,
        //profile도 같이 반환해줄 것 , postWithProfile type
        //각 포스트별로 유저 정보도 같이 보여줄 수 있음
        profile: {
          user_id: profile?.user_id,
          name: profile?.name,
          image: profile?.image,
        },
      };
    });
    //Promise.all => 모든 프로미스가 완료될때까지 기다린다음 결과를 배열로 반환
    const result = await Promise.all(objPromises);
    return result;
  } catch (error) {
    throw error;
  }
};

export default useGetAllPosts;
