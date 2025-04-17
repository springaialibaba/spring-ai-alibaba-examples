export interface McpConversationViewProps {
  conversationId: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface McpMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface InputResultProps {
  messages: Message[];
  title?: string;
}

export interface McpServerResponse {
  id: string;
  name: string;
  desc: string;
  toolList: McpToolResponse[];
}

export interface McpToolResponse {
  name: string;
  params: Record<string, string>;
  desc: string;
}

export interface McpToolFormatted {
  id: string;
  name: string;
  description: string;
  params: Record<string, string>;
}

export interface McpServerFormatted {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tools: McpToolFormatted[];
}

export interface McpServer {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface McpTool {
  id: string;
  name: string;
  description?: string;
}
