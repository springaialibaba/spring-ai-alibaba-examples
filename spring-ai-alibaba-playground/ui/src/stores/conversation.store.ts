import { atom, useAtom } from "jotai";
import { MenuPage } from "./functionMenu.store";
import { GetProp } from "antd";
import { Bubble } from "@ant-design/x";
import { useEffect, useRef } from "react";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  blob?: Blob;
  // 用于localStorage持久化
  dataUrl?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  images?: GeneratedImage[];
}

export interface Conversation {
  id: string;
  title: string;
  type: MenuPage;
  messages: ChatMessage[];
  createdAt: number;
}

// 存储键名
const STORAGE_KEY = "app_conversations";

// 处理blob到dataUrl的转换，用于持久化
const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 在保存前处理会话数据
const prepareConversationsForStorage = async (
  conversations: Conversation[]
): Promise<Conversation[]> => {
  const processedConversations = JSON.parse(
    JSON.stringify(conversations)
  ) as Conversation[];

  // 处理每个会话
  for (const conversation of processedConversations) {
    // 处理每条消息
    for (const message of conversation.messages) {
      // 处理图片
      if (message.images) {
        for (const image of message.images) {
          // 如果有blob但没有dataUrl，转换并保存
          if (image.blob && !image.dataUrl) {
            try {
              // 为了避免异步问题，我们这里不等待转换完成
              // 只在下次保存时才会包含dataUrl
              blobToDataUrl(image.blob).then((dataUrl) => {
                image.dataUrl = dataUrl;
              });
            } catch (e) {
              console.error("Failed to convert blob to dataUrl:", e);
            }
          }

          // 移除blob字段，不适合存储在localStorage
          delete image.blob;
        }
      }
    }
  }

  return processedConversations;
};

// 从 localStorage 加载数据
const loadConversationsFromStorage = (): Conversation[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load conversations from localStorage:", error);
  }
  return [];
};

// 初始化时从 localStorage 加载数据
const initialConversations = loadConversationsFromStorage();

const conversationsAtom = atom<Conversation[]>(initialConversations);
const activeConversationAtom = atom<Conversation | null>(null);

export const useConversationContext = () => {
  const [conversations, setConversations] = useAtom(conversationsAtom);
  const [activeConversation, setActiveConversation] = useAtom(
    activeConversationAtom
  );

  // 跟踪是否有待保存的更改
  const pendingSaveRef = useRef<number | null>(null);

  // 当 conversations 变化时保存到 localStorage
  useEffect(() => {
    // 使用防抖来减少保存频率
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current);
    }

    pendingSaveRef.current = setTimeout(async () => {
      try {
        // 在保存前处理数据
        const processedConversations = await prepareConversationsForStorage(
          conversations
        );
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(processedConversations)
        );
        console.log("Saved conversations to localStorage");
      } catch (error) {
        console.error("Failed to save conversations to localStorage:", error);
      }
    }, 500);

    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
      }
    };
  }, [conversations]);

  const createConversation = (
    type: MenuPage,
    items: GetProp<typeof Bubble.List, "items">
  ) => {
    console.log("previous createConversation", conversations);

    // 根据类型生成合适的标题和唯一ID
    const timestamp = Date.now();
    let title = "";
    switch (type) {
      case MenuPage.Chat:
        title = `对话 ${timestamp.toString().slice(-8)}`;
        break;
      case MenuPage.ImageGen:
        title = `图像生成 ${timestamp.toString().slice(-8)}`;
        break;
      default:
        title = `对话 ${timestamp.toString().slice(-8)}`;
    }

    const newConversation: Conversation = {
      id: timestamp.toString(),
      title,
      type,
      messages: [],
      createdAt: timestamp,
    };
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation);
    return newConversation;
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(
      conversations.filter((conv) => conv.id !== conversationId)
    );
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  const updateConversations = (conversations: Conversation[]) => {
    setConversations([...conversations]);
  };

  const updateActiveConversation = (conversation: Conversation) => {
    console.log("Updating conversation:", conversation.id);
    console.log("New messages:", conversation.messages);

    // 更新 conversations 数组
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversation.id ? conversation : conv
    );

    console.log("Updated conversations:", updatedConversations);
    setConversations(updatedConversations);

    // 如果是当前活跃的对话，也更新 activeConversation
    if (activeConversation?.id === conversation.id) {
      console.log("Updating active conversation");
      setActiveConversation(conversation);
    }
  };

  const updateConversationWithoutLocalStorage = (
    conversation: Conversation
  ) => {
    // 更新 conversations 数组
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversation.id ? conversation : conv
    );

    setConversations(updatedConversations);

    // 如果是当前活跃的对话，也更新 activeConversation
    if (activeConversation?.id === conversation.id) {
      setActiveConversation(conversation);
    }
  };

  const addMessage = (message: ChatMessage) => {
    if (!activeConversation) {
      console.error("No active conversation to add message to");
      return;
    }

    console.log("Adding message to conversation:", message);
    console.log("Current conversation messages:", activeConversation.messages);

    // 创建更新后的对话对象
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
    };

    console.log("Updated conversation messages:", updatedConversation.messages);

    // 更新 conversations 数组
    const updatedConversations = conversations.map((conv) =>
      conv.id === activeConversation.id ? updatedConversation : conv
    );

    // 更新状态
    setConversations(updatedConversations);
    setActiveConversation(updatedConversation);

    // 直接更新到 localStorage 确保保存
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConversations));
      console.log(
        "addMessage: Directly saved to localStorage with new message"
      );
    } catch (error) {
      console.error("addMessage: Failed to save to localStorage:", error);
    }
  };

  const updateConversationTitle = (
    conversationId: string,
    newTitle: string
  ) => {
    if (!newTitle.trim()) return; // 不允许空标题

    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, title: newTitle } : conv
    );

    setConversations(updatedConversations);

    // 如果是当前活跃的对话，也更新 activeConversation
    if (activeConversation?.id === conversationId) {
      setActiveConversation({ ...activeConversation, title: newTitle });
    }
  };

  const chooseActiveConversation = (conversationId: string) => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (conversation) {
      setActiveConversation(conversation);
    }
  };

  const clearActiveConversation = () => {
    setActiveConversation(null);
  };

  return {
    conversations,
    activeConversation,
    createConversation,
    deleteConversation,
    updateConversations,
    updateActiveConversation,
    updateConversationWithoutLocalStorage,
    chooseActiveConversation,
    clearActiveConversation,
    addMessage,
    updateConversationTitle,
  };
};
