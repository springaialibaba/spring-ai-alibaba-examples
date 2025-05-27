import { useCallback, useEffect, useState, useRef } from "react";
import { useXAgent, useXChat } from "@ant-design/x";
import { useNavigate } from "react-router-dom";
import { decoder } from "../utils";
import { getChat } from "../api/chat";
import { useConversationContext } from "../stores/conversation.store";
import { useFunctionMenuStore } from "../stores/functionMenu.store";
import { useModelConfigContext } from "../stores/modelConfig.store";
import { MenuPage } from "../stores/functionMenu.store";

// 添加全局声明以支持临时图片存储
declare global {
  interface Window {
    tempImageBase64?: string;
  }
}

export const useChat = (conversationId?: string) => {
  const navigate = useNavigate();
  const {
    activeConversation,
    createConversation,
    chooseActiveConversation,
    addMessage,
    updateActiveConversation,
  } = useConversationContext();

  const { inputtingContent, updateInputtingContent, communicateTypes } =
    useFunctionMenuStore();

  const { currentModel } = useModelConfigContext();

  // 聊天内容状态
  const [items, setItems] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

  // 控制状态
  const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // 添加一个ref来跟踪消息是否已发送
  const hasSentPendingMessageRef = useRef(false);

  // 添加一个ref标记是否是初始加载
  const isInitialLoadRef = useRef(true);

  // 添加去重ID跟踪
  const processedMessageIds = useRef(new Set<string>());

  // 获取请求参数
  const getRequestParams = useCallback(() => {
    return {
      image: attachedFiles?.[0]?.originFileObj,
      chatId: activeConversation?.id,
      model: currentModel?.value,
      deepThink: communicateTypes.deepThink,
      onlineSearch: communicateTypes.onlineSearch,
    };
  }, [attachedFiles, activeConversation, currentModel, communicateTypes]);

  // 定义 Agent
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate }) => {
      setIsRequesting(true);
      let buffer = "";
      const timestamp = Date.now();
      onUpdate(JSON.stringify({ role: "ai", value: "" }));

      try {
        const res = await getChat(
          encodeURIComponent(JSON.parse(message || "{}")?.value || ""),
          (value) => {
            buffer = buffer + decoder.decode(value);
            onUpdate(JSON.stringify({ role: "ai", value: buffer }));
          },
          {
            ...getRequestParams(),
          }
        );

        let value: string;
        if (res?.status === 200) {
          value = buffer;

          // 保存 AI 回复到历史记录
          addMessage({
            role: "assistant",
            content: value,
            timestamp: timestamp,
          });

          // 确保AI回复作为ai角色而不是aiHistory保存在UI上
          onSuccess(JSON.stringify({ role: "ai", value }));
        } else {
          value = "请求失败." + (res?.statusText ? " " + res?.statusText : "");
          onSuccess(JSON.stringify({ role: "ai", value }));
        }
      } catch (error) {
        console.error("AI请求错误:", error);
        onSuccess(
          JSON.stringify({
            role: "ai",
            value: "抱歉，处理您的请求时出现错误。",
          })
        );
      } finally {
        setIsRequesting(false);
      }
    },
  });

  // 使用 XChat hook
  const {
    onRequest: originalOnRequest,
    messages,
    setMessages,
  } = useXChat({
    agent,
  });

  // 包装 onRequest 函数，添加保存用户消息到历史记录的功能
  const onRequest = useCallback(
    (message: string) => {
      try {
        // 解析消息
        const parsedMessage = JSON.parse(message);

        // 保存用户消息到历史记录
        if (parsedMessage.role === "local" && parsedMessage.value) {
          // 生成消息唯一ID (组合用户内容和时间)
          const timestamp = Date.now();
          const messageId = `${parsedMessage.value}_${timestamp}`;

          // 检查是否已处理过该消息，避免重复
          if (!processedMessageIds.current.has(messageId)) {
            processedMessageIds.current.add(messageId);

            // 先添加到messages列表确保UI显示
            const localMessage = {
              id: `msg_${timestamp}`,
              message: message,
              status: "success" as const,
            };

            // 更新UI显示的消息
            setMessages((prev) => [...prev, localMessage]);

            // 保存到历史记录
            addMessage({
              role: "user",
              content: parsedMessage.value,
              timestamp: timestamp,
            });
          }
        }

        // 调用原始的 onRequest 函数发送请求
        originalOnRequest(message);
      } catch (error) {
        console.error("处理消息错误:", error);
        originalOnRequest(message);
      }
    },
    [originalOnRequest, addMessage, setMessages]
  );

  // 当组件加载时选择正确的对话，添加依赖检查避免不必要的更新
  useEffect(() => {
    if (
      conversationId &&
      (!activeConversation || activeConversation.id !== conversationId)
    ) {
      console.log("useChat: 选择会话", conversationId);
      // 清空现有消息，防止旧消息混淆
      setMessages([]);
      setItems([]);
      // 强制重置加载状态
      isInitialLoadRef.current = true;
      processedMessageIds.current.clear();
      // 选择新的会话
      chooseActiveConversation(conversationId);
    }
  }, [
    conversationId,
    chooseActiveConversation,
    activeConversation,
    setMessages,
  ]);

  // 仅处理初始加载时的待发送消息，而不会响应用户正常输入
  useEffect(() => {
    if (
      conversationId &&
      inputtingContent &&
      inputtingContent.trim().length > 0 && // 确保内容不为空
      activeConversation &&
      activeConversation.id === conversationId &&
      !hasSentPendingMessageRef.current && // 仅当消息未发送过时处理
      isInitialLoadRef.current // 仅在初始加载时处理
    ) {
      console.log("useChat: 处理初始待发送消息", inputtingContent);

      // 标记消息已发送且不再是初始加载
      hasSentPendingMessageRef.current = true;
      isInitialLoadRef.current = false;

      // 设置一个小延迟，防止可能的反复触发
      // 注意：此处延迟时间增加以确保组件有时间处理初始状态
      setTimeout(() => {
        // 在发送前检查是否有重复
        const timestamp = Date.now();
        const messageId = `${inputtingContent}_${timestamp}`;
        if (!processedMessageIds.current.has(messageId)) {
          processedMessageIds.current.add(messageId);

          onRequest(
            JSON.stringify({
              role: "local",
              value: inputtingContent,
            })
          );
          // 清空输入内容
          updateInputtingContent("");
        }
      }, 500); // 进一步增加延迟时间
    }
  }, [
    conversationId,
    inputtingContent,
    onRequest,
    updateInputtingContent,
    activeConversation,
  ]);

  // 当inputtingContent改变为空时重置标记
  useEffect(() => {
    if (!inputtingContent) {
      hasSentPendingMessageRef.current = false;
    }
  }, [inputtingContent]);

  // 当活跃对话变化时，加载历史消息
  useEffect(() => {
    // 如果正在请求中，则不加载历史消息
    if (isRequesting) {
      console.log("跳过历史消息加载 - 请求进行中");
      return;
    }

    // 当conversationId改变或activeConversation改变时，强制重新加载消息
    if (activeConversation && activeConversation.id === conversationId) {
      if (activeConversation.messages.length > 0) {
        // 将历史消息转换为 useXChat 需要的格式
        const formattedMessages = activeConversation.messages.map(
          (msg, index) => {
            // 保留原始角色，确保用户消息和AI回复都能正确显示
            const role = msg.role === "user" ? "local" : "aiHistory";
            // 使用消息的时间戳作为稳定的ID
            return {
              id: `msg_${msg.timestamp}`,
              message: JSON.stringify({
                role: role,
                value: msg.content,
              }),
              status: "success" as const,
            };
          }
        );

        console.log("设置历史消息到messages:", formattedMessages);
        setMessages(formattedMessages);
      } else {
        // 如果没有历史消息，清空消息列表
        setMessages([]);
      }
    }
  }, [
    activeConversation?.id,
    activeConversation?.messages,
    setMessages,
    conversationId,
    isRequesting,
  ]);

  console.log("msg 2 items", messages, items);
  // 将 messages 转换为 items
  useEffect(() => {
    setItems(
      messages.map(({ id, message }, index) => {
        try {
          const item = JSON.parse(message || "{}");
          const value = item?.value;

          if (item?.role === "file") {
            return {
              key: id,
              role: item?.role,
              loading: !value,
              content: value?.base64,
            };
          } else {
            return {
              key: id,
              role: item?.role,
              loading: !value,
              content: value,
            };
          }
        } catch (error) {
          console.error("解析消息错误:", error);
          return {
            key: id,
            role: "local",
            loading: false,
            content: "消息解析错误",
          };
        }
      })
    );
  }, [messages]);

  // 重试消息
  const handleRetry = useCallback(() => {
    if (messages.length < 2) return;

    // 获取最后一个用户消息
    const request = messages[messages.length - 2]?.message;

    // 从当前 messages 中移除最新的两条消息（用户消息和AI回复）
    setMessages(messages.slice(0, messages.length - 2));

    // 如果有 activeConversation，也更新历史记录
    if (activeConversation && activeConversation.messages.length >= 2) {
      const updatedMessages = [...activeConversation.messages];
      updatedMessages.splice(-2, 2); // 移除最后两条消息

      // 创建更新后的对话对象
      const updatedConversation = {
        ...activeConversation,
        messages: updatedMessages,
      };

      // 更新对话
      updateActiveConversation(updatedConversation);
    }

    // 重新发送请求
    if (request) {
      onRequest(request);
    }
  }, [
    messages,
    activeConversation,
    setMessages,
    updateActiveConversation,
    onRequest,
  ]);

  // 处理消息提交
  const handleSubmit = useCallback(
    (content: string) => {
      if (!content) return;

      // 标记消息已经手动发送，避免自动发送机制重复发送
      hasSentPendingMessageRef.current = true;
      isInitialLoadRef.current = false;

      // 生成消息唯一ID并检查是否已处理
      const timestamp = Date.now();
      const messageId = `${content}_${timestamp}`;
      if (processedMessageIds.current.has(messageId)) {
        console.log("消息已被处理，跳过:", content);
        return;
      }
      processedMessageIds.current.add(messageId);

      setIsFileUploadEnabled(false);

      // 处理图片上传
      if (attachedFiles.length > 0) {
        setMessages([
          ...messages,
          {
            id: `msg_img_${timestamp}`,
            message: JSON.stringify({
              role: "file",
              value: {
                base64: window.tempImageBase64,
              },
            }),
            status: "success" as const,
          },
        ]);

        // 保存图片到历史记录
        if (activeConversation) {
          addMessage({
            role: "user",
            content: "图片上传",
            timestamp: timestamp,
            images: [
              {
                id: timestamp.toString(),
                url: window.tempImageBase64 || "",
                prompt: "用户上传图片",
              },
            ],
          });
        }

        // 清除临时图片
        window.tempImageBase64 = undefined;
      }

      setAttachedFiles([]);

      // 如果没有 conversationId，说明是类页面，需要创建新对话并跳转
      if (!conversationId) {
        // 创建新对话
        const newConversation = createConversation(MenuPage.Chat, []);
        updateInputtingContent(content);
        // 跳转到新创建的对话页面，让新页面处理消息发送
        console.log("useChat: 导航到新会话", newConversation.id);
        navigate(`/chat/${newConversation.id}`);
      } else {
        // 如果有 conversationId，说明是实例页面，直接发送消息
        console.log("useChat: 发送消息", content);
        onRequest(
          JSON.stringify({
            role: "local",
            value: content,
          })
        );
        updateInputtingContent("");
      }
    },
    [
      conversationId,
      createConversation,
      navigate,
      onRequest,
      updateInputtingContent,
      setMessages,
      messages,
      activeConversation,
      addMessage,
      attachedFiles,
      setIsFileUploadEnabled,
      setAttachedFiles,
    ]
  );

  return {
    // 状态
    items,
    isRequesting,
    isFileUploadEnabled,
    attachedFiles,

    // 动作
    handleSubmit,
    handleRetry,
    setIsFileUploadEnabled,
    setAttachedFiles,

    // 原始数据
    messages,
    agent,
  };
};
