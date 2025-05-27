import React from "react";
import { useParams } from "react-router-dom";
import ImageGenLandingView from "./ImageGenLandingView";
import ImageGenConversationView from "./ImageGenConversationView";

/**
 * ImageGenPage - 图像生成功能页面
 *
 * 主要功能:
 * 1. 根据路由参数决定显示落地页还是会话页
 * 2. 如果URL中有conversationId，显示会话页面
 * 3. 如果URL中没有conversationId，显示落地页
 */
const ImageGenPage: React.FC = () => {
  // 获取URL参数中的conversationId
  const { conversationId } = useParams<{ conversationId: string }>();

  // 根据是否有conversationId决定显示哪个视图
  if (conversationId) {
    // 如果有conversationId，显示图像生成对话页面
    return <ImageGenConversationView conversationId={conversationId} />;
  } else {
    // 如果没有conversationId，显示图像生成落地页
    return <ImageGenLandingView />;
  }
};

export default ImageGenPage;
