import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Sender } from "@ant-design/x";
import { Card, message } from "antd";
import { useStyles } from "./style";
import GeneratedImage from "./components/generatedImage";
import BasePage from "../components/BasePage";
import { useConversationContext } from "../../stores/conversation.store";
import { getImage } from "../../api/image";

// 定义API响应类型
interface ImageResponse {
  blob?: Blob;
  status?: number;
}

interface GeneratedImageType {
  id: string;
  url: string;
  prompt: string;
  blob?: Blob;
}

// 扩展消息类型，添加加载和错误状态
interface ExtendedChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  images?: GeneratedImageType[];
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * ImageGenConversationView - 图像生成会话视图组件
 *
 * 负责:
 * 1. 显示特定会话的图像生成记录
 * 2. 处理图像生成请求和响应
 * 3. 支持重新生成图像
 * 4. 保存生成的图像到历史记录
 */
const ImageGenConversationView: React.FC<{ conversationId: string }> = ({
  conversationId,
}) => {
  const { styles } = useStyles();
  const location = useLocation();
  const [inputContent, setInputContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    activeConversation,
    chooseActiveConversation,
    updateActiveConversation,
    addMessage,
  } = useConversationContext();

  // 跟踪组件是否首次加载，用于处理来自URL的prompt参数
  const isFirstLoad = useRef(true);
  const processedPrompts = useRef(new Set<string>());
  const objectUrlsRef = useRef<string[]>([]);

  // 选择正确的对话
  useEffect(() => {
    chooseActiveConversation(conversationId);
  }, [conversationId, chooseActiveConversation]);

  // 组件卸载时清理创建的Object URL
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectUrlsRef.current = [];
    };
  }, []);

  // 处理URL中的prompt参数
  useEffect(() => {
    if (isFirstLoad.current && activeConversation) {
      const queryParams = new URLSearchParams(location.search);
      const urlPrompt = queryParams.get("prompt");

      if (urlPrompt && !processedPrompts.current.has(urlPrompt)) {
        // 标记此prompt已处理，避免重复生成
        processedPrompts.current.add(urlPrompt);

        // 延迟一点处理以确保组件完全加载
        setTimeout(() => {
          handleGenerateImage(urlPrompt);
        }, 300);
      }

      isFirstLoad.current = false;
    }
  }, [location.search, activeConversation]);

  // 恢复存储的图像
  useEffect(() => {
    if (activeConversation) {
      let hasChanges = false;
      const updatedMessages = activeConversation.messages.map((message) => {
        if (message.role === "assistant" && message.images) {
          const updatedImages = message.images.map((image) => {
            if (
              image.dataUrl &&
              (!image.url || image.url.startsWith("blob:") || !image.blob)
            ) {
              hasChanges = true;
              return {
                ...image,
                url: image.dataUrl,
              };
            }
            return image;
          });

          return {
            ...message,
            images: updatedImages,
          };
        }
        return message;
      });

      if (hasChanges) {
        updateActiveConversation({
          ...activeConversation,
          messages: updatedMessages,
        });
      }
    }
  }, [activeConversation?.id]);

  const handleGenerateImage = async (prompt: string) => {
    if (!prompt.trim()) return;
    if (!activeConversation) return;

    setIsGenerating(true);
    console.log("生成图像开始, prompt:", prompt);

    // 添加用户消息
    const userMessage = {
      role: "user" as const,
      content: prompt,
      timestamp: Date.now(),
    };

    // 添加生成中的占位消息
    const placeholderMessage: ExtendedChatMessage = {
      role: "assistant" as const,
      content: "生成中...",
      timestamp: Date.now() + 1,
      isLoading: true,
    };

    // 更新会话，包含占位消息
    const updatedMessages = [
      ...activeConversation.messages,
      userMessage,
      placeholderMessage,
    ] as ExtendedChatMessage[];
    const updatedConversation = {
      ...activeConversation,
      messages: updatedMessages,
    };
    updateActiveConversation(updatedConversation);

    let timeoutId: number | null = null;

    try {
      // 设置超时检测
      timeoutId = window.setTimeout(() => {
        // 如果仍在生成，则认为超时
        if (isGenerating) {
          setIsGenerating(false);

          // 替换占位消息为超时消息
          const timeoutMessages = updatedMessages.map((msg) =>
            msg === placeholderMessage
              ? ({
                  ...msg,
                  content: "图像生成超时，请重试",
                  isLoading: false,
                  isError: true,
                } as ExtendedChatMessage)
              : msg
          );

          updateActiveConversation({
            ...activeConversation,
            messages: timeoutMessages,
          });

          message.error("图像生成超时，请重试");
        }
      }, 30000); // 30秒超时

      // 调用图像生成API
      console.log("调用图像生成API...");
      let response: ImageResponse | null = null;

      try {
        response = (await getImage(prompt)) as ImageResponse;
        console.log("API响应:", response);

        // 清除超时检测
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (response && response.blob) {
          console.log(
            "收到blob响应，大小:",
            response.blob.size,
            "类型:",
            response.blob.type
          );

          // 创建URL以显示图像
          const imageUrl = URL.createObjectURL(response.blob);
          console.log("创建的Object URL:", imageUrl);

          // 保存URL以便后续清理
          objectUrlsRef.current.push(imageUrl);

          // 创建生成的图像对象
          const generatedImages: GeneratedImageType[] = [
            {
              id: `img-${Date.now()}`,
              url: imageUrl,
              prompt: prompt,
              blob: response.blob,
            },
          ];

          // 添加助手消息，包含生成的图像
          const assistantMessage: ExtendedChatMessage = {
            role: "assistant" as const,
            content: "",
            timestamp: Date.now(),
            images: generatedImages,
          };

          // 更新会话，移除占位消息，添加真实图像
          const finalMessages = activeConversation.messages
            .filter((msg) => msg !== placeholderMessage)
            .concat([userMessage, assistantMessage]);

          console.log("更新会话，添加生成的图像");
          updateActiveConversation({
            ...activeConversation,
            messages: finalMessages,
          });

          // 清空输入
          setInputContent("");
        } else {
          // 替换占位消息为错误消息
          const errorMessages = updatedMessages.map((msg) =>
            msg === placeholderMessage
              ? ({
                  ...msg,
                  content: "图像生成失败，请重试",
                  isLoading: false,
                  isError: true,
                } as ExtendedChatMessage)
              : msg
          );

          updateActiveConversation({
            ...activeConversation,
            messages: errorMessages,
          });

          console.error("响应中没有blob数据");
          message.error("图像生成失败，请重试");
        }
      } catch (error) {
        // 清除超时检测
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // 替换占位消息为错误消息
        const errorMessages = updatedMessages.map((msg) =>
          msg === placeholderMessage
            ? ({
                ...msg,
                content: "图像生成错误，请重试",
                isLoading: false,
                isError: true,
              } as ExtendedChatMessage)
            : msg
        );

        updateActiveConversation({
          ...activeConversation,
          messages: errorMessages,
        });

        console.error("生成图像错误:", error);
        message.error("图像生成失败，请重试");
      }
    } finally {
      // 确保清除任何剩余的超时检测
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsGenerating(false);
    }
  };

  // 重新生成图像
  const handleRegenerate = async (prompt: string, imageId: string) => {
    if (!activeConversation) return;

    setIsGenerating(true);

    try {
      // 调用图像生成API
      const response = (await getImage(prompt)) as ImageResponse;

      if (response && response.blob) {
        // 创建URL以显示图像
        const imageUrl = URL.createObjectURL(response.blob);
        // 保存URL以便后续清理
        objectUrlsRef.current.push(imageUrl);

        // 创建新的图像对象
        const newImage: GeneratedImageType = {
          id: `img-${Date.now()}`,
          url: imageUrl,
          prompt: prompt,
          blob: response.blob,
        };

        // 更新消息中的图像
        const updatedMessages = activeConversation.messages.map((message) => {
          if (message.role === "assistant" && message.images) {
            return {
              ...message,
              images: message.images.map((img) =>
                img.id === imageId ? newImage : img
              ),
            };
          }
          return message;
        });

        // 更新会话
        updateActiveConversation({
          ...activeConversation,
          messages: updatedMessages,
        });
      } else {
        message.error("图像重新生成失败");
      }
    } catch (error) {
      console.error("重新生成图像错误:", error);
      message.error("图像重新生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <BasePage title="图像生成" conversationId={conversationId}>
      <div className={styles.container}>
        {/* 输入框区域 */}
        <div className={styles.inputArea}>
          <Sender
            value={inputContent}
            onChange={setInputContent}
            onSubmit={handleGenerateImage}
            placeholder="请输入图片生成提示词..."
            className={styles.sender}
            loading={isGenerating}
          />
        </div>

        {/* 消息和生成的图片展示区域 */}
        <div style={{ marginTop: "24px" }}>
          {activeConversation?.messages.map((message: any) => (
            <div key={message.timestamp}>
              {/* 用户消息 */}
              {message.role === "user" && (
                <div
                  style={{
                    marginLeft: "auto",
                    maxWidth: "80%",
                    textAlign: "right",
                    padding: "12px 16px",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                >
                  {message.content}
                </div>
              )}

              {/* 占位消息或错误消息 */}
              {message.role === "assistant" && !message.images && (
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    background: (message as ExtendedChatMessage).isError
                      ? "#fff2f0"
                      : "#f0f9ff",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    color: (message as ExtendedChatMessage).isError
                      ? "#cf1322"
                      : "#000000d9",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {(message as ExtendedChatMessage).isLoading && (
                    <div style={{ marginRight: "8px" }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ animation: "rotate 1s linear infinite" }}
                      >
                        <style>
                          {`
                            @keyframes rotate {
                              from { transform: rotate(0deg); }
                              to { transform: rotate(360deg); }
                            }
                          `}
                        </style>
                        <path
                          d="M8 1V4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 12V15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.4"
                        />
                        <path
                          d="M4 4L5.5 5.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.8"
                        />
                        <path
                          d="M10.5 10.5L12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.4"
                        />
                        <path
                          d="M1 8H4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.6"
                        />
                        <path
                          d="M12 8H15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.4"
                        />
                        <path
                          d="M4 12L5.5 10.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.4"
                        />
                        <path
                          d="M10.5 5.5L12 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.4"
                        />
                      </svg>
                    </div>
                  )}
                  {message.content}
                </div>
              )}

              {/* 生成的图片 */}
              {message.role === "assistant" && message.images && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 24,
                    marginBottom: "32px",
                    maxWidth: "1200px",
                  }}
                >
                  {message.images.map((image) => (
                    <Card
                      key={image.id}
                      bodyStyle={{ padding: 0 }}
                      style={{
                        width: "100%",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      <GeneratedImage
                        id={image.id}
                        url={image.url}
                        prompt={image.prompt}
                        onReload={(prompt) =>
                          handleRegenerate(prompt, image.id)
                        }
                      />
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BasePage>
  );
};

export default ImageGenConversationView;
