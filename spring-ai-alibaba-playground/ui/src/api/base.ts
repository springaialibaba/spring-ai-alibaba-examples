import { BASE_URL } from "../constant";

const decoder = new TextDecoder("utf-8");

// 获取支持的模型列表
export const getModels = async () => {
  const res = (await fetch(BASE_URL + "/dashscope/getModels", {
    method: "GET"
  })) as any;

  const reader = res.body.getReader();

  let bufffer = "";
  await reader.read().then(function process({ done, value }) {
    if (done) return;

    bufffer += decoder.decode(value);

    return reader.read().then(process);
  });

  return JSON.parse(bufffer).data;
};

// 服务器是否还在运行
export const getIsHealth = async () => {
  const controller = new AbortController(); // 控制请求终止
  const time = setTimeout(() => controller.abort(), 3000);

  const res = (await fetch(BASE_URL + "/health", {
    method: "GET",
    signal: controller.signal
  })) as any;

  clearTimeout(time);
  return res.data;
};
