import { BASE_URL } from "../constant";

// 上传文档创建知识库
export const createKnowledgeBase = async (
  name: string,
  files: File[]
): Promise<{ id: string; name: string }> => {
  const formData = new FormData();
  formData.append("name", name);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${BASE_URL}/rag/knowledge-base`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create knowledge base");
  }

  return response.json();
};

// 获取所有知识库
export const getKnowledgeBases = async (): Promise<
  Array<{ id: string; name: string }>
> => {
  const response = await fetch(`${BASE_URL}/rag/knowledge-bases`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch knowledge bases");
  }

  return response.json();
};

// 删除知识库
export const deleteKnowledgeBase = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/rag/knowledge-base/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete knowledge base");
  }
};

// RAG查询
export const ragQuery = async (
  prompt: string,
  knowledgeBaseId: string,
  callback?: (value: Uint8Array) => void
): Promise<Response> => {
  const res = await fetch(`${BASE_URL}/rag/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      knowledgeBaseId: knowledgeBaseId,
    },
    body: prompt,
  });

  if (!res.ok) {
    throw new Error("Failed to query RAG");
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get response reader");
  }

  await reader.read().then(function process({ done, value }) {
    if (done) return;
    callback?.(value);
    return reader.read().then(process);
  });

  return res;
};
