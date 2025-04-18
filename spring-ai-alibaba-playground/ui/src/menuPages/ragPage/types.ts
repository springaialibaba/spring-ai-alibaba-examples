import { KnowledgeBase } from "../../stores/knowledgeBase.store";

export interface RagMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface RagUiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
}

export type { KnowledgeBase };
