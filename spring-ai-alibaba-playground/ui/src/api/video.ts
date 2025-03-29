import { BASE_URL } from "../constant";

// 解析视频接口
export const postVideo = async (
  vedio: File,
  callback: (value: Uint8Array) => void,
  params?: {
    prompt?: string;
  }
) => {
  const { prompt } = params || {};

  const formData = new FormData();
  formData.append("prompt", prompt || "");
  formData.append("vedio", vedio);
  const res = (await fetch(BASE_URL + "/video-qa", {
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
