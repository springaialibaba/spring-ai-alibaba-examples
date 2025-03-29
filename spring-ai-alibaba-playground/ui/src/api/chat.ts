import { BASE_URL } from "../constant";

export const getChat = async (
  prompt: string,
  callback: (value: Uint8Array) => void,
  params?: {
    model?: string;
    chatId?: string;
    deepThink?: boolean;
    onlineSearch?: boolean;
  }
) => {
  const { model, chatId, onlineSearch, deepThink } = params || {};

  let res: any;
  if (onlineSearch) {
    res = (await fetch(BASE_URL + "/search?query=" + prompt, {
      method: "GET",
      headers: {
        chatId: chatId ? chatId : ""
      }
    })) as any;
  } else if (deepThink) {
    res = (await fetch(BASE_URL + "/deep-thinking/chat?prompt=" + prompt, {
      method: "GET",
      headers: {
        model: model ? model : "",
        chatId: chatId ? chatId : ""
      }
    })) as any;
  } else {
    res = (await fetch(BASE_URL + "/chat?prompt=" + prompt, {
      method: "GET",
      headers: {
        model: model ? model : "",
        chatId: chatId ? chatId : ""
      }
    })) as any;
  }

  const reader = res.body.getReader();
  await reader.read().then(function process({ done, value }) {
    if (done) return;

    callback(value);

    return reader.read().then(process);
  });

  return res;
};
