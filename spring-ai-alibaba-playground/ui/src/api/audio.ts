import { BASE_URL } from "../constant";

// 生成语音接口
export const getAudio = async (prompt: string) => {
  const res = (await fetch(BASE_URL + "/text2audio?prompt" + prompt, {
    method: "GET"
  })) as any;

  return res.blob();
};

// 解析语音接口
export const postAudio = async (
  audio: File,
  callback: (value: Uint8Array) => void
) => {
  const formData = new FormData();
  formData.append("audio", audio);
  const res = (await fetch(BASE_URL + "/audio2text", {
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
