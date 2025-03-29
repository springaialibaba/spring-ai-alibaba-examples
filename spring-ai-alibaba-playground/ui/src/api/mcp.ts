import { BASE_URL } from "../constant";

export const getMcp = async (prompt: string, chatId: string) => {
  const res = (await fetch(BASE_URL + "/chat?prompt=" + prompt, {
    method: "GET",
    headers: {
      chatId: chatId ? chatId : ""
    }
  })) as any;

  return res.data;
};
