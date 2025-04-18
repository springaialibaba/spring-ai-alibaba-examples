import React, { useState, useEffect, useRef } from "react";
import { Sender } from "@ant-design/x";
import BasePage from "../components/BasePage";
import KnowledgeBaseList from "./components/KnowledgeBaseList";
import { RagMessage } from "./types";
import { useStyles } from "./style";
// import { ragQuery } from "../../api/rag";
import {
  KnowledgeBase,
  useKnowledgeBaseStore,
} from "../../stores/knowledgeBase.store";
import RequestBubble from "../components/RequestBubble";
import ResponseBubble from "../components/ResponseBubble";
import { Empty } from "antd";

const RagPage = () => {
  const { styles } = useStyles();
  const { activeKnowledgeBase } = useKnowledgeBaseStore();
  const [messages, setMessages] = useState<RagMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const decoder = new TextDecoder();

  // 当知识库改变时，加载对话历史
  useEffect(() => {
    if (activeKnowledgeBase) {
      loadMessages(activeKnowledgeBase.id);
    } else {
      setMessages([]);
    }
  }, [activeKnowledgeBase?.id]);

  // 当消息更新时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 加载消息历史
  const loadMessages = (knowledgeBaseId: string) => {
    try {
      const stored = localStorage.getItem(`rag_messages_${knowledgeBaseId}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("加载消息历史失败:", error);
      setMessages([]);
    }
  };

  // 保存消息历史
  const saveMessages = (knowledgeBaseId: string, messages: RagMessage[]) => {
    try {
      localStorage.setItem(
        `rag_messages_${knowledgeBaseId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error("保存消息历史失败:", error);
    }
  };

  // 创建用户消息
  const createUserMessage = (text: string): RagMessage => ({
    id: `user_${Date.now()}`,
    sender: "user",
    text,
    timestamp: Date.now(),
  });

  // 创建AI响应消息
  const createAssistantMessage = (
    text: string,
    isError: boolean = false
  ): RagMessage => ({
    id: `assistant_${Date.now()}`,
    sender: "assistant",
    text,
    timestamp: Date.now(),
    isError,
  });

  // 发送消息
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !activeKnowledgeBase) return;

    setIsLoading(true);
    setInputValue("");

    // 创建用户消息并添加到消息列表
    const userMessage = createUserMessage(text);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // 默认空的响应文本
    let responseText = "";

    try {
      // 调用RAG查询API
      // const response = await ragQuery(text, activeKnowledgeBase.id, (value) => {
      //   const chunk = decoder.decode(value);
      //   responseText += chunk;

      //   // 更新界面上的响应（流式）
      //   const assistantMessage = createAssistantMessage(responseText);
      //   setMessages([...updatedMessages, assistantMessage]);
      // });

      // if (!response.ok) {
      //   throw new Error("RAG查询失败");
      // }

      // 最终消息
      const finalMessages = [
        ...updatedMessages,
        createAssistantMessage(responseText),
      ];

      setMessages(finalMessages);

      // 保存消息到localStorage
      saveMessages(activeKnowledgeBase.id, finalMessages);
    } catch (error) {
      console.error("RAG查询错误:", error);

      // 添加错误消息
      const errorMessage = createAssistantMessage(
        "抱歉，处理您的查询时出现错误。",
        true
      );
      const finalMessages = [...updatedMessages, errorMessage];

      setMessages(finalMessages);
      saveMessages(activeKnowledgeBase.id, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染消息列表
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          {/* <DatabaseOutlined
            style={{ fontSize: 64, opacity: 0.6 }}
            className={styles.placeholderImage}
          /> */}
          <Empty
            description="选择一个知识库，开始RAG对话"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    return (
      <div className={styles.messagesContainer}>
        {messages.map((message) =>
          message.sender === "user" ? (
            <RequestBubble
              key={message.id}
              content={message.text}
              timestamp={message.timestamp}
            />
          ) : (
            <ResponseBubble
              key={message.id}
              content={message.text}
              timestamp={message.timestamp}
              isError={message.isError}
            />
          )
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <BasePage title="RAG">
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <KnowledgeBaseList
            knowledgeBases={[]}
            activeKnowledgeBaseId={null}
            // TODO: 需要和服务端商量下 RAG 的流程和规范
            onSelect={() => {}}
            onUpdate={() => {}}
          />
          <div className={styles.senderWrapper}>
            <Sender
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSendMessage}
              placeholder="输入查询内容..."
              loading={isLoading}
              disabled={!activeKnowledgeBase}
            />
          </div>
        </div>
        <div className={styles.rightPanel}>{renderMessages()}</div>
      </div>
    </BasePage>
  );
};

export default RagPage;
