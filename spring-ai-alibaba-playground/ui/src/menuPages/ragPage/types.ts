import { KnowledgeBase } from "../../stores/knowledgeBase.store";

export interface RagMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: number;
  isError?: boolean;
}

export type { KnowledgeBase };
