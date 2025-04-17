import { BASE_URL } from "../constant";

interface McpResponse {
  data: string;
  code: number;
  message?: string;
}

export const getMcp = async (
  prompt: string,
  chatId: string
): Promise<McpResponse> => {
  try {
    const res = await fetch(
      BASE_URL + "/mcp?prompt=" + encodeURIComponent(prompt),
      {
        method: "GET",
        headers: {
          chatId: chatId || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      return {
        code: 0,
        data: text,
      };
    }

    // 如果是JSON格式，检查是否有标准结构
    if (data && typeof data === "object") {
      if (data.code !== undefined) {
        return data as McpResponse;
      } else {
        // 如果是其他JSON格式，包装为标准格式返回
        return {
          code: 0,
          data: JSON.stringify(data),
        };
      }
    }

    // 默认返回
    return {
      code: 0,
      data: text,
    };
  } catch (error) {
    console.error("MCP API 调用错误:", error);
    throw error;
  }
};
