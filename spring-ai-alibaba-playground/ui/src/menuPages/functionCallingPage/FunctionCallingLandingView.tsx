import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sender } from "@ant-design/x";
import CodeInfo from "./components/CodeInfo";
import OutputResult from "./components/OutputResult";
import { useConversationContext } from "../../stores/conversation.store";
import { MenuPage } from "../../stores/functionMenu.store";
import { useStyles } from "./style";

const FunctionCallingLandingView = () => {
  const { styles } = useStyles();
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { createConversation } = useConversationContext();

  const handleCreateConversation = (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const newConversation = createConversation(MenuPage.Mcp, [], content);
      navigate(
        `/tool-calling/${newConversation.id}?prompt=${encodeURIComponent(
          content
        )}`
      );
    } catch (error) {
      console.error("创建MCP对话错误:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <CodeInfo />
        <div className={styles.senderWrapper}>
          <Sender
            value={inputContent}
            onChange={setInputContent}
            onSubmit={handleCreateConversation}
            placeholder="请输入您想查询的地区和日期，例如：北京今天的天气..."
            className={styles.sender}
            loading={isLoading}
          />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <OutputResult messages={[]} title="天气查询功能演示" />
      </div>
    </div>
  );
};

export default FunctionCallingLandingView;
