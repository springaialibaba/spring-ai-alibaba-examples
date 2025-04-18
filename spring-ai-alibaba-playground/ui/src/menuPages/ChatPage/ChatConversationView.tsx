import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Sender } from "@ant-design/x";
import { useStyle } from "./style";
import { useConversationContext } from "../../stores/conversation.store";
import BasePage from "../components/BasePage";
import { getChat } from "../../api/chat";
import { Button, theme } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Attachments } from "@ant-design/x";
import { actionButtonConfig, MAX_IMAGE_SIZE } from "../../const";
import {
  decoder,
  litFileSize,
  mapStoredMessagesToUIMessages,
  scrollToBottom,
} from "../../utils";
import { useFunctionMenuStore } from "../../stores/functionMenu.store";
import { useModelConfigContext } from "../../stores/modelConfig.store";
import {
  AiCapabilities,
  ChatConversationViewProps,
  ChatMessage,
  Message,
} from "./types";
import ResponseBubble from "../components/ResponseBubble";
import RequestBubble from "../components/RequestBubble";
import { useThrottle } from "../../hooks";

const ChatConversationView: React.FC<ChatConversationViewProps> = ({
  conversationId,
}) => {
  const { token } = theme.useToken();
  const { styles } = useStyle();
  const location = useLocation();
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { currentModel } = useModelConfigContext();
  const { menuCollapsed } = useFunctionMenuStore();

  const {
    activeConversation,
    chooseActiveConversation,
    updateActiveConversation,
    aiCapabilities,
    toggleCapability,
    updateCapability,
  } = useConversationContext();

  // 跟踪组件是否首次加载，用于处理URL中的prompt参数
  const isFirstLoad = useRef(true);
  const processedPrompts = useRef(new Set<string>());

  useEffect(() => {
    chooseActiveConversation(conversationId);
  }, [conversationId, chooseActiveConversation]);

  useEffect(() => {
    scrollToBottom(messagesContainerRef.current);
  }, [messages]);

  // 从存储的会话中加载消息
  useEffect(() => {
    if (activeConversation) {
      if (
        activeConversation.messages &&
        activeConversation.messages.length > 0
      ) {
        const filteredMessages = activeConversation.messages.filter(
          (msg) => !(msg as any).isLoading
        );

        if (filteredMessages.length > 0) {
          const uiMessages = mapStoredMessagesToUIMessages(
            filteredMessages as ChatMessage[]
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
      const onlineSearch = queryParams.get("onlineSearch") === "true";
      const deepThink = queryParams.get("deepThink") === "true";

      // 更新通信类型
      if (onlineSearch) {
        updateCapability("onlineSearch", true);
      } else if (deepThink) {
        updateCapability("deepThink", true);
      }

      if (urlPrompt && !processedPrompts.current.has(urlPrompt)) {
        // 标记此prompt已处理，避免重复处理
        processedPrompts.current.add(urlPrompt);
        // 清除URL中的prompt参数，防止刷新页面重复发送
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        const timeId = setTimeout(() => {
          if (activeConversation && !isLoading) {
            handleSendMessage(urlPrompt);
          }
          clearTimeout(timeId);
        }, 100);
      }

      isFirstLoad.current = false;
    }
  }, [location.search, activeConversation, updateCapability, isLoading]);

  const updateConversationMessages = useThrottle(
    (
      messageContent: string,
      role: "assistant" | "assistant",
      isError: boolean = false,
      userTimestamp: number,
      userMessage: ChatMessage
    ) => {
      const timestamp = Date.now();
      const responseMessage: ChatMessage = {
        role: role,
        content: messageContent,
        timestamp: timestamp,
        isError: isError,
      };
      const responseMessageUI: Message = mapStoredMessagesToUIMessages([
        responseMessage,
      ])[0];
      setMessages((prev) => [...prev, responseMessageUI]);

      // 确保用户消息存在
      const existingUserMessage = activeConversation?.messages.find(
        (msg) => msg.timestamp === userTimestamp && msg.role === "user"
      );
      // 如果用户消息不存在，先添加
      const baseMessages = existingUserMessage
        ? activeConversation?.messages
        : [...(activeConversation?.messages || []), userMessage];

      // TODO: 目前还没有添加占位消息。。。。
      // 更新会话，移除占位消息，添加新消息
      const finalMessages = baseMessages
        ?.filter((msg) => !(msg as ChatMessage).isLoading)
        .concat([responseMessage]);

      if (!activeConversation?.id) {
        throw new Error("会话ID为空!");
      }

      updateActiveConversation({
        ...activeConversation,
        messages: finalMessages as unknown as ChatMessage[],
      });
    },
    500
  );

  // 发送消息到API并更新会话
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !activeConversation) return;

    setIsLoading(true);
    setInputContent(""); // 清空输入框
    // 记录当前时间戳，确保消息顺序
    const userTimestamp = Date.now();
    console.log("text", text, userTimestamp);

    // 创建用户消息
    const userMessage: ChatMessage = {
      role: "user",
      content: text,
      timestamp: userTimestamp,
    };
    const userMessageUI: Message = mapStoredMessagesToUIMessages([
      userMessage,
    ])[0];
    setMessages((prev) => [...prev, userMessageUI]);

    const updatedWithUserMessage = [
      ...activeConversation.messages,
      userMessage,
    ] as ChatMessage[];
    // 立即保存用户消息到localStorage(即使后续API调用失败)
    updateActiveConversation({
      ...activeConversation,
      messages: updatedWithUserMessage,
    });

    scrollToBottom(messagesContainerRef.current);

    try {
      const params = {
        chatId: activeConversation?.id,
        model: currentModel?.value,
        deepThink: aiCapabilities.deepThink,
        onlineSearch: aiCapabilities.onlineSearch,
      };
      let response;
      let responseText = "";

      try {
        response = await getChat(
          text,
          (value) => {
            const chunk = decoder.decode(value);
            responseText += chunk;

            // 频率太快会导致闪动
            const isLastChunk = value.length === 0;
            if (isLastChunk || responseText.length % 6 === 0) {
              updateConversationMessages(
                responseText,
                "assistant",
                false,
                userTimestamp,
                userMessage
              );
            }
          },
          params
        );

        if (response.ok && responseText) {
          // 最终更新一次，确保完整内容被保存
          updateConversationMessages(
            responseText,
            "assistant",
            false,
            userTimestamp,
            userMessage
          );
        } else {
          throw new Error("请求失败");
        }
      } catch (error) {
        console.error("处理聊天请求错误:", error, "响应文本:", responseText);

        updateConversationMessages(
          "抱歉，处理您的请求时出现错误。",
          "assistant",
          true,
          userTimestamp,
          userMessage
        );
      }
    } catch (error) {
      console.error("处理聊天请求错误:", error);

      const errorTimestamp = Date.now();
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "抱歉，处理您的请求时出现错误。",
        timestamp: errorTimestamp,
        isError: true,
      };
      const errorMessageUI: Message = mapStoredMessagesToUIMessages([
        errorMessage,
      ])[0];
      setMessages((prev) => [...prev, errorMessageUI]);

      const existingUserMessage = activeConversation.messages.find(
        (msg) => msg.timestamp === userTimestamp && msg.role === "user"
      );

      // 如果用户消息不存在，先添加
      const baseMessages = existingUserMessage
        ? activeConversation.messages
        : [...activeConversation.messages, userMessage];

      // 更新会话，移除占位消息，添加错误消息
      const finalMessages = baseMessages
        .filter((msg) => !(msg as ChatMessage).isLoading) // 移除所有加载中的消息
        .concat([errorMessage]);

      if (!activeConversation?.id) return;
      updateActiveConversation({
        ...activeConversation,
        messages: finalMessages,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文件上传变化
  const handleFileChange = (info: any) => {
    if (
      info.fileList?.length > 0 &&
      litFileSize(info.fileList?.[0]?.originFileObj as any, MAX_IMAGE_SIZE)
    ) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target?.result;
        // 暂存图片 base64
        window.tempImageBase64 = base64String as string;
      };
      reader.readAsDataURL(info.fileList?.[0]?.originFileObj as File);

      setAttachedFiles(info.fileList);
    }

    if (info.fileList?.length === 0) {
      setAttachedFiles(info.fileList);
    }
  };

  // 创建附件上传区域
  // const senderHeader = (
  //   <Sender.Header
  //     title="附件"
  //     open={isFileUploadEnabled}
  //     onOpenChange={setIsFileUploadEnabled}
  //     styles={{
  //       header: {
  //         background: token.colorBgElevated,
  //       },
  //       content: {
  //         padding: 0,
  //       },
  //     }}
  //   >
  //     <Attachments
  //       accept=".jpg, .jpeg, .png, .webp"
  //       maxCount={1}
  //       beforeUpload={() => false}
  //       items={attachedFiles}
  //       onChange={handleFileChange}
  //       placeholder={(type) =>
  //         type === "drop"
  //           ? { title: "拖放文件到这里" }
  //           : {
  //               icon: <CloudUploadOutlined />,
  //               title: "上传文件",
  //               description: "点击或拖拽文件到此区域上传",
  //             }
  //       }
  //     />
  //   </Sender.Header>
  // );

  return (
    <BasePage title="对话" conversationId={conversationId}>
      <div className={styles.container}>
        <div ref={messagesContainerRef} className={styles.messagesContainer}>
          {messages.length === 0 && !conversationId ? (
            <ResponseBubble
              content="你好，请问有什么可以帮你的吗？"
              timestamp={Date.now()}
            />
          ) : (
            messages.map((message) =>
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
            )
          )}
        </div>

        <div
          className={`${styles.chatPageSender} ${
            menuCollapsed
              ? styles.senderContainerCollapsed
              : styles.senderContainer
          }`}
        >
          <div className={styles.actionButtons}>
            {actionButtonConfig.map((button) => {
              const isActive =
                aiCapabilities[button.key as keyof AiCapabilities];
              return (
                <Button
                  key={button.key}
                  type="text"
                  icon={button.icon}
                  style={{
                    color: isActive ? "#fff" : button.baseColor,
                    background: isActive
                      ? button.activeColor
                      : token.colorBgElevated,
                    border: "2px solid #eee3",
                  }}
                  onClick={() => {
                    toggleCapability(button.key as keyof AiCapabilities);
                  }}
                >
                  {button.label}
                </Button>
              );
            })}
          </div>
          <Sender
            value={inputContent}
            // header={senderHeader}
            onSubmit={handleSendMessage}
            // allowSpeech
            onChange={setInputContent}
            // prefix={attachmentsNode}
            loading={isLoading}
            className={styles.sender}
            placeholder={"您可以问我任何问题..."}
          />
        </div>
      </div>
    </BasePage>
  );
};

export default ChatConversationView;
