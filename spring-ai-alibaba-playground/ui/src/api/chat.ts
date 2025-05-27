import { BASE_URL } from "../constant";

interface ChatParams {
  model?: string;
  chatId?: string;
  deepThink?: boolean;
  onlineSearch?: boolean;
}

export const getChat = async (
  prompt: string,
  callback: (value: Uint8Array) => void,
  params?: ChatParams
): Promise<Response> => {
  const { model, chatId, onlineSearch, deepThink } = params || {};

  let res: Response;
  if (onlineSearch) {
    res = await fetch(BASE_URL + "/search?query=" + prompt, {
      method: "GET",
      headers: {
        chatId: chatId || "",
      },
    });
  } else if (deepThink) {
    res = await fetch(BASE_URL + "/deep-thinking/chat?prompt=" + prompt, {
      method: "GET",
      headers: {
        model: model || "",
        chatId: chatId || "",
      },
    });
  } else {
    res = await fetch(BASE_URL + "/chat?prompt=" + prompt, {
      method: "GET",
      headers: {
        model: model || "",
        chatId: chatId || "",
      },
    });
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get response reader");
  }

  await reader.read().then(function process({ done, value }) {
    if (done) return;
    callback(value);
    return reader.read().then(process);
  });

  return res;
};
