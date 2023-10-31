import { storage } from "@/libs/AppWriteClient";
import Image from "image-js";

const useChangeUserImage = async (
  file: File,
  cropper: any,
  currentImage: string
) => {
  //36진수(숫자, 소문자 알파벳 포함) 문자열의 2~22번째 자리까지 추출(Math.random에 의해 생성된 접두사 제거)
  let videoId = Math.random().toString(36).slice(2, 22);

  const x = cropper.left;
  const y = cropper.top;
  const width = cropper.width;
  const height = cropper.height;

  try {
    //fetch => URL에서 객체를 가져옴(여기서는 url),
    //createObjectURL => 객체를 URL로 변환함(일시적인 로컬 URL, 파일을 업로드 하지 않고도 웹에 표시할 수 있음)
    const response = await fetch(URL.createObjectURL(file));
    //arrayBuffer() => 이진 버퍼데이터로 변환
    const imageBuffer = await response.arrayBuffer();

    const image = await Image.load(imageBuffer);
    const croppedImage = image.crop({ x, y, width, height });
    const resizedImage = croppedImage.resize({ width: 200, height: 200 });
    const blob = await resizedImage.toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const finalFile = new File([arrayBuffer], file.name, { type: blob.type });
    const result = await storage.createFile(
      String(process.env.NEXT_PUBLIC_BUCKET_ID),
      videoId,
      finalFile
    );

    if (
      //사용자 지정 이미지일 경우(기본이미지가 아닌)
      //기본이미지일 경우 삭제하면 안됨
      currentImage !=
      String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEFAULT_IMAGE_ID)
    ) {
      await storage.deleteFile(
        String(process.env.NEXT_PUBLIC_BUCKET_ID),
        currentImage
      );
    }

    return result?.$id;
  } catch (error) {
    throw error;
  }
};

export default useChangeUserImage;
