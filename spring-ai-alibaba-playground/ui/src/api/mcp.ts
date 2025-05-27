import { BASE_URL } from "../constant";
import { Result } from "./base";

interface McpResponse {
  data: string;
}

export const getMcp = async (
  prompt: string,
  chatId: string
): Promise<McpResponse> => {
  const res = await fetch(BASE_URL + "/chat?prompt=" + prompt, {
    method: "GET",
    headers: {
      chatId: chatId || "",
    },
  });

  const result: Result<string> = await res.json();
  return { data: result.data };
};
