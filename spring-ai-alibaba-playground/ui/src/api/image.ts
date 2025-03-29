import { BASE_URL } from "../constant";

// 生成图片接口
export const getImage = async (
  prompt: string,
  params?: {
    style?: string; // 图片格式
    resolution?: string; // 图像宽高，范围在 512 ～ 1440，默认是 1080 * 1080
  }
) => {
  const { style, resolution } = params || {};

  const res = (await fetch(
    BASE_URL +
      "/text2image?prompt" +
      prompt +
      (style ? "&style" + style : "") +
      (resolution ? "&resolution" + resolution : ""),
    {
      method: "GET"
    }
  )) as any;

  return res.blob();
};

// 解析图片接口
export const postImage = async (
  image: File,
  callback: (value: Uint8Array) => void,
  params?: {
    prompt?: string;
  }
) => {
  const { prompt } = params || {};

  const formData = new FormData();
  formData.append("prompt", prompt || "");
  formData.append("image", image);
  const res = (await fetch(BASE_URL + "/image2text", {
    method: "POST",
    body: formData
  })) as any;

  const reader = res.body.getReader();
  await reader.read().then(function process({ done, value }) {
    if (done) return;

    callback(value);

    return reader.read().then(process);
  });

  return res;
};
