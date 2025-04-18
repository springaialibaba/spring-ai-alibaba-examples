import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sender, Bubble } from "@ant-design/x";
import { actionButtonConfig, PlaceholderNode } from "../../const";
import { useStyle } from "./style";
import {
  MenuPage,
  useFunctionMenuStore,
} from "../../stores/functionMenu.store";
import { useConversationContext } from "../../stores/conversation.store";
import BasePage from "../components/BasePage";
import { Button, theme } from "antd";

const ChatLandingView: React.FC = () => {
  const { styles } = useStyle();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { createConversation, aiCapabilities, toggleCapability } =
    useConversationContext();
  const { menuCollapsed } = useFunctionMenuStore();

  const handlePromptClick = (info: { data: { description: string } }) => {
    setInputValue(info.data.description);
  };

  const handleCreateConversation = (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // 创建新对话，传递内容用于生成标题
      const newConversation = createConversation(MenuPage.Chat, [], content);

      // 构建URL参数
      let params = new URLSearchParams();
      params.append("prompt", content);

      if (aiCapabilities.onlineSearch) {
        params.append("onlineSearch", "true");
      }
      if (aiCapabilities.deepThink) {
        params.append("deepThink", "true");
      }

      // 导航到会话页面并传递参数
      navigate(`/chat/${newConversation.id}?${params.toString()}`);
    } catch (error) {
      console.error("创建聊天对话错误:", error);
      setIsLoading(false);
    }
  };

  return (
    <BasePage title="对话" className={styles.chat}>
      <div className={styles.landingContainer}>
        {/* 中间占位区域 - 可以放置欢迎信息、功能介绍等 */}
        <div className={styles.landingContent}>
          <Bubble.List
            items={[
              {
                content: (
                  <PlaceholderNode
                    className={styles.placeholder}
                    onPromptsItemClick={handlePromptClick}
                  />
                ),
                variant: "borderless",
              },
            ]}
            className={styles.messages}
          />
        </div>

        {/* 底部发送区域 */}
        <div
          className={`${styles.landingSender} ${
            menuCollapsed ? styles.landingSenderCollapsed : ""
          }`}
        >
          <div className={styles.actionButtons}>
            {actionButtonConfig.map((button) => {
              const isActive =
                aiCapabilities[button.key as keyof typeof aiCapabilities];
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
                    toggleCapability(button.key as keyof typeof aiCapabilities);
                  }}
                >
                  {button.label}
                </Button>
              );
            })}
          </div>
          <Sender
            value={inputValue}
            onChange={(value: string) => setInputValue(value)}
            onSubmit={handleCreateConversation}
            // allowSpeech
            placeholder="您可以问我任何问题..."
            loading={isLoading}
          />
        </div>
      </div>
    </BasePage>
  );
};

export default ChatLandingView;
