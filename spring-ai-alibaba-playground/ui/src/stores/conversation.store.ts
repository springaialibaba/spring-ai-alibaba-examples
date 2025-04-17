import { atom, useAtom } from "jotai";
import { MenuPage } from "./functionMenu.store";
import { GetProp } from "antd";
import { Bubble } from "@ant-design/x";
import { useEffect, useRef } from "react";

/**
 * 生成图像的数据结构
 */
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  blob?: Blob;
  dataUrl?: string;
}

/**
 * 聊天消息的数据结构
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  images?: GeneratedImage[];
}

/**
 * AI模型能力配置
 */
export interface AiCapabilities {
  deepThink: boolean;
  onlineSearch: boolean;
}

/**
 * 对话会话的数据结构
 */
export interface Conversation {
  id: string;
  title: string;
  type: MenuPage;
  messages: ChatMessage[];
  createdAt: number;
  capabilities?: AiCapabilities;
}

// 存储键名
const STORAGE_KEY = "app_conversations";

/**
 * 将Blob对象转换为DataURL格式
 * @param blob - 要转换的Blob对象
 * @returns 转换后的DataURL字符串
 */
const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 处理会话数据用于存储
 * 主要处理图片数据，将blob转换为dataUrl
 * @param conversations - 要处理的会话列表
 * @returns 处理后可以存储的会话列表
 */
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

/**
 * 从localStorage加载会话数据
 * @returns 存储的会话列表，如果没有则返回空数组
 */
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
const aiCapabilitiesAtom = atom<AiCapabilities>({
  deepThink: false,
  onlineSearch: false,
});

/**
 * 用于管理对话上下文的React Hook
 * 提供对话的创建、更新、删除和读取功能
 * 自动将对话数据持久化到localStorage
 * @returns 包含对话状态和操作方法的对象
 */
export const useConversationContext = () => {
  const [conversations, setConversations] = useAtom(conversationsAtom);
  const [activeConversation, setActiveConversation] = useAtom(
    activeConversationAtom
  );
  const [aiCapabilities, setAiCapabilities] = useAtom(aiCapabilitiesAtom);

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

  /**
   * 更新特定AI能力的状态
   * @param key - 要更新的能力名称
   * @param value - 是否启用该能力
   */
  const updateCapability = (key: keyof AiCapabilities, value: boolean) => {
    // 当前逻辑是互斥的（只能启用一种能力），但未来可能会支持多种同时启用
    const newCapabilities = Object.keys(aiCapabilities).reduce((acc, k) => {
      acc[k as keyof AiCapabilities] = false;
      return acc;
    }, {} as AiCapabilities);

    if (value) {
      newCapabilities[key] = true;
    }

    setAiCapabilities(newCapabilities);

    if (activeConversation) {
      const updatedConversation = {
        ...activeConversation,
        capabilities: newCapabilities,
      };
      updateActiveConversation(updatedConversation);
    }
  };

  /**
   * 切换特定AI能力的状态
   * @param key - 要切换的能力名称
   */
  const toggleCapability = (key: keyof AiCapabilities) => {
    const currentValue = aiCapabilities[key];
    updateCapability(key, !currentValue);
  };

  useEffect(() => {
    if (activeConversation?.capabilities) {
      setAiCapabilities(activeConversation.capabilities);
    } else {
      setAiCapabilities({
        deepThink: false,
        onlineSearch: false,
      });
    }
  }, [activeConversation?.id]);

  /**
   * 创建新的对话会话
   * @param type - 对话类型
   * @param items - 初始消息项
   * @param content - 用户输入内容，可选，用于生成标题
   * @returns 新创建的对话会话对象
   */
  const createConversation = (
    type: MenuPage,
    items: GetProp<typeof Bubble.List, "items">,
    content?: string
  ) => {
    // UUID
    const timestamp = Date.now();
    let title = "";

    if (content && content.trim()) {
      const maxLength = 15;
      title =
        content.trim().length > maxLength
          ? `${content.trim().substring(0, maxLength)}...`
          : content.trim();
    } else {
      title = `对话 ${timestamp.toString().slice(-8)}`;
    }

    const newConversation: Conversation = {
      id: timestamp.toString(),
      title,
      type,
      messages: [],
      createdAt: timestamp,
      capabilities: { ...aiCapabilities }, // 保存当前能力设置
    };
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation);
    return newConversation;
  };

  /**
   * 删除指定ID的对话会话
   * @param conversationId - 要删除的对话ID
   */
  const deleteConversation = (conversationId: string) => {
    setConversations(
      conversations.filter((conv) => conv.id !== conversationId)
    );
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  /**
   * 更新全部对话会话列表
   * @param conversations - 新的对话会话列表
   */
  const updateConversations = (conversations: Conversation[]) => {
    setConversations([...conversations]);
  };

  /**
   * 更新指定的对话会话，会同时更新localStorage
   * @param conversation - 要更新的对话会话对象
   */
  const updateActiveConversation = (conversation: Conversation) => {
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

  /**
   * 更新指定的对话会话，但不更新localStorage
   * @param conversation - 要更新的对话会话对象
   */
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

  // /**
  //  * 向当前活跃的对话添加新消息
  //  * @param message - 要添加的消息对象
  //  */
  // const addMessage = (message: ChatMessage) => {
  //   if (!activeConversation) {
  //     console.error("No active conversation to add message to");
  //     return;
  //   }
  //   // 创建更新后的对话对象
  //   const updatedConversation = {
  //     ...activeConversation,
  //     messages: [...activeConversation.messages, message],
  //   };
  //   // 更新 conversations 数组
  //   const updatedConversations = conversations.map((conv) =>
  //     conv.id === activeConversation.id ? updatedConversation : conv
  //   );

  //   // 更新状态
  //   setConversations(updatedConversations);
  //   setActiveConversation(updatedConversation);

  //   // 直接更新到 localStorage 确保保存
  //   try {
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConversations));
  //   } catch (error) {
  //     console.error("addMessage: Failed to save to localStorage:", error);
  //   }
  // };

  /**
   * 更新对话的标题
   * @param conversationId - 要更新标题的对话ID
   * @param newTitle - 新的标题
   */
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

  /**
   * 选择指定ID的对话作为当前活跃对话
   * @param conversationId - 要选择的对话ID
   */
  const chooseActiveConversation = (conversationId: string) => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (conversation) {
      setActiveConversation(conversation);
    }
  };

  /**
   * 清除当前活跃的对话
   */
  const clearActiveConversation = () => {
    setActiveConversation(null);
  };

  return {
    conversations,
    activeConversation,
    aiCapabilities,
    updateCapability,
    toggleCapability,
    createConversation,
    deleteConversation,
    updateConversations,
    updateActiveConversation,
    updateConversationWithoutLocalStorage,
    chooseActiveConversation,
    clearActiveConversation,
    updateConversationTitle,
  };
};
