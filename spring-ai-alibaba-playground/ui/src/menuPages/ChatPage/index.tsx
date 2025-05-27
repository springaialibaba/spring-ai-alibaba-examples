import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import ChatLandingView from "./ChatLandingView";
import ChatConversationView from "./ChatConversationView";
import BasePage from "../components/BasePage";
import { useStyle } from "./style";

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const isNavigatingRef = useRef(false);
  const { styles } = useStyle();

  const handleNavigation = () => {
    isNavigatingRef.current = true;
  };

  return (
    <BasePage title="对话" className={styles.chat}>
      {conversationId ? (
        <ChatConversationView conversationId={conversationId} />
      ) : (
        <ChatLandingView onNavigation={handleNavigation} />
      )}
    </BasePage>
  );
};

export default ChatPage;
