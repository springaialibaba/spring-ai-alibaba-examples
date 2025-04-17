// TODO: 可能不需要这个文件了
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Sender } from "@ant-design/x";
import CodeInfo from "./components/CodeInfo";
import OutputResult from "./components/OutputResult";
import { useConversationContext } from "../../stores/conversation.store";
import BasePage from "../components/BasePage";
import { McpMessage, Message } from "./types";
import { getMcp } from "../../api/mcp";
import { useStyles } from "./style";

// 将存储的消息转换为UI显示的消息
const mapStoredMessagesToUIMessages = (messages: McpMessage[]): Message[] => {
  if (!messages || !Array.isArray(messages)) {
    console.warn("无效的消息数组:", messages);
    return [];
  }

  return messages
    .filter((msg) => !(msg as McpMessage).isLoading) // 过滤掉加载中的消息
    .map((msg) => {
      return {
        id: `msg-${msg.timestamp}`,
        text: msg.content || "",
        sender: msg.role === "user" ? "user" : "bot",
        timestamp: new Date(msg.timestamp),
      };
    });
};

interface McpConversationViewProps {
  conversationId: string;
}

const McpConversationView = ({ conversationId }: McpConversationViewProps) => {
  const { styles } = useStyles();
  const location = useLocation();
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    activeConversation,
    chooseActiveConversation,
    updateActiveConversation,
  } = useConversationContext();

  // 跟踪组件是否首次加载，用于处理URL中的prompt参数
  const isFirstLoad = useRef(true);
  const processedPrompts = useRef(new Set<string>());

  // 选择正确的对话
  useEffect(() => {
    chooseActiveConversation(conversationId);
  }, [conversationId, chooseActiveConversation]);

  // 从存储的会话中加载消息
  useEffect(() => {
    if (activeConversation) {
      // 确保消息数组存在并且有内容
      if (
        activeConversation.messages &&
        activeConversation.messages.length > 0
      ) {
        const filteredMessages = activeConversation.messages.filter(
          (msg) => !(msg as McpMessage).isLoading
        );

        if (filteredMessages.length > 0) {
          const uiMessages = mapStoredMessagesToUIMessages(
            filteredMessages as McpMessage[]
          );
          setMessages(uiMessages);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  }, [activeConversation?.id, activeConversation?.messages]);

  // 处理URL中的prompt参数
  useEffect(() => {
    if (isFirstLoad.current && activeConversation) {
      const queryParams = new URLSearchParams(location.search);
      const urlPrompt = queryParams.get("prompt");

      if (urlPrompt && !processedPrompts.current.has(urlPrompt)) {
        // 标记此prompt已处理，避免重复处理
        processedPrompts.current.add(urlPrompt);
        console.log("从URL参数获取提示词:", urlPrompt);

        // 清除URL中的prompt参数，防止刷新页面重复发送
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        // 设置输入内容并自动发送
        setTimeout(() => {
          handleSendMessage(urlPrompt);
        }, 300);
      }

      isFirstLoad.current = false;
    }
  }, [location.search, activeConversation]);

  // 发送消息到API并更新会话
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !activeConversation) return;

    setIsLoading(true);
    setInputContent(""); // 清空输入框

    // 记录当前时间戳，确保消息顺序
    const userTimestamp = Date.now();
    const placeholderTimestamp = userTimestamp + 1;

    // 创建用户消息
    const userMessage: McpMessage = {
      role: "user",
      content: text,
      timestamp: userTimestamp,
    };

    // 创建用户消息的UI表示
    const userMessageUI: Message = {
      id: `msg-${userTimestamp}`,
      text: text,
      sender: "user",
      timestamp: new Date(userTimestamp),
    };

    // 创建加载中的占位消息
    const placeholderMessage: McpMessage = {
      role: "assistant",
      content: "生成中...",
      timestamp: placeholderTimestamp,
      isLoading: true,
    };

    // 确保UI显示用户消息
    setMessages((prev) => [...prev, userMessageUI]);

    console.log("处理发送消息:", text, "用户ID:", userMessageUI.id);

    // 先只更新用户消息到会话存储，确保即使API调用失败，用户消息也会被保存
    const updatedWithUserMessage = [
      ...activeConversation.messages,
      userMessage,
    ] as McpMessage[];

    // 立即保存用户消息到localStorage，即使后续API调用失败
    updateActiveConversation({
      ...activeConversation,
      messages: updatedWithUserMessage,
    });

    try {
      // 添加占位消息到会话（不会显示在UI中，仅作为API请求过程中的状态标记）
      updateActiveConversation({
        ...activeConversation,
        messages: [...updatedWithUserMessage, placeholderMessage],
      });

      // 使用getMcp函数替换直接的fetch调用
      const response = await getMcp(text, conversationId);

      // 检查响应状态码
      if (response.code !== 0 || !response.data) {
        throw new Error(response.message || "Failed to get response");
      }

      // 创建助手消息
      const assistantTimestamp = Date.now();
      const assistantMessage: McpMessage = {
        role: "assistant",
        content: response.data,
        timestamp: assistantTimestamp,
      };

      // 创建助手消息的UI表示
      const assistantMessageUI: Message = {
        id: `msg-${assistantTimestamp}`,
        text: response.data,
        sender: "bot",
        timestamp: new Date(assistantTimestamp),
      };

      setMessages((prev) => [...prev, assistantMessageUI]);

      // 更新会话，移除占位消息，保留用户消息和添加真实回复
      const finalMessages = activeConversation.messages
        .filter((msg) => !(msg as McpMessage).isLoading) // 移除所有加载中的消息
        .concat([assistantMessage]);

      updateActiveConversation({
        ...activeConversation,
        messages: finalMessages,
      });
    } catch (error) {
      console.error("处理MCP请求错误:", error);

      // 创建错误消息
      const errorTimestamp = Date.now();
      const errorMessage: McpMessage = {
        role: "assistant",
        content: "抱歉，处理您的请求时出现错误。",
        timestamp: errorTimestamp,
        isError: true,
      };

      // 创建错误消息的UI表示
      const errorMessageUI: Message = {
        id: `msg-${errorTimestamp}`,
        text: "抱歉，处理您的请求时出现错误。",
        sender: "bot",
        timestamp: new Date(errorTimestamp),
      };

      // 添加错误消息到UI显示
      setMessages((prev) => [...prev, errorMessageUI]);

      // 确保用户消息依然存在
      const existingUserMessage = activeConversation.messages.find(
        (msg) => msg.timestamp === userTimestamp && msg.role === "user"
      );

      // 如果用户消息不存在，先添加
      const baseMessages = existingUserMessage
        ? activeConversation.messages
        : [...activeConversation.messages, userMessage];

      // 更新会话，移除占位消息，添加错误消息
      const finalMessages = baseMessages
        .filter((msg) => !(msg as McpMessage).isLoading) // 移除所有加载中的消息
        .concat([errorMessage]);

      console.log("更新错误后的消息列表:", finalMessages);

      updateActiveConversation({
        ...activeConversation,
        messages: finalMessages,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasePage title="MCP" conversationId={conversationId}>
      <div className={styles.container}>
        {/* 左侧面板 - 代码展示和输入框 */}
        <div className={styles.leftPanel}>
          <CodeInfo />
          <div className={styles.senderWrapper}>
            <Sender
              value={inputContent}
              onChange={setInputContent}
              onSubmit={handleSendMessage}
              placeholder="开始对话..."
              className={styles.sender}
              loading={isLoading}
            />
          </div>
        </div>

        {/* 右侧面板 - 对话记录展示 */}
        <div className={styles.rightPanel}>
          <OutputResult messages={messages} title="MCP 对话" />
        </div>
      </div>
    </BasePage>
  );
};

export default McpConversationView;
