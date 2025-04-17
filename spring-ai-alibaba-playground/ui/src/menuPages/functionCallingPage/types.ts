export interface McpConversationViewProps {
  conversationId: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

export interface FunctionCallingUiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
}

export interface InputResultProps {
  messages: Message[];
  title?: string;
}
