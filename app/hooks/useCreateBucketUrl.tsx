const useCreateBucketUrl = (fileId: string) => {
  const url = process.env.NEXT_PUBLIC_APPWRITE_URL;
  const id = process.env.NEXT_PUBLIC_BUCKET_ID;
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

  if (!url || !id || !endpoint || !fileId) return "";

  //파일의 버킷 url을 생성해주는 훅임
  return `${url}/storage/buckets/${id}/files/${fileId}/view?project=${endpoint}`;
};

export default useCreateBucketUrl;
