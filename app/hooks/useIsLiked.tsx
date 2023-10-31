import { Like } from "../types";

const useIsLiked = (userId: string, postId: string, likes: Array<Like>) => {
  let res: Like[] = [];
  likes?.forEach((like) => {
    if (like.user_id == userId && like.post_id == postId) res.push(like);
  });
  if (typeof res == undefined) return; //오류 발생시
  //좋아요를 했으면 참(길이가 1)
  return res.length > 0;
};

export default useIsLiked;
