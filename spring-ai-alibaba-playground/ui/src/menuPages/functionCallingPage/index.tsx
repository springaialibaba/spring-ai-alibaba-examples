import React from "react";
import { useParams } from "react-router-dom";
import FunctionCallingConversationView from "./FunctionCallingConversationView";
import FunctionCallingLandingView from "./FunctionCallingLandingView";

const FunctionCallingPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();

  if (conversationId) {
    return <FunctionCallingConversationView conversationId={conversationId} />;
  } else {
    return <FunctionCallingLandingView />;
  }
};

export default FunctionCallingPage;
