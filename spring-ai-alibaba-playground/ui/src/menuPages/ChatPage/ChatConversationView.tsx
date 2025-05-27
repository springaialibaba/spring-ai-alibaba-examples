import React, { useCallback, useEffect, useRef, useState } from "react";
import { Attachments, Bubble, Sender } from "@ant-design/x";
import { Badge, Button, Space, theme } from "antd";
import {
  CloudUploadOutlined,
  CopyOutlined,
  PaperClipOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useStyle } from "./style";
import { actionButtonConfig, MAX_IMAGE_SIZE } from "../../constant";
import { litFileSize } from "../../utils";
import { useFunctionMenuStore } from "../../stores/functionMenu.store";
import { useChat } from "../../hooks/useChat";

interface ChatConversationViewProps {
  conversationId: string;
}

const ChatConversationView: React.FC<ChatConversationViewProps> = ({
  conversationId,
}) => {
  const { token } = theme.useToken();
  const { styles } = useStyle();
  const {
    inputtingContent,
    updateInputtingContent,
    communicateTypes,
    updateCommunicateTypes,
  } = useFunctionMenuStore();

  // 控制输入
  const [localInputValue, setLocalInputValue] = useState("");

  // 跟踪本组件是否已经处理了初始消息
  const hasHandledInitialMessageRef = useRef(false);

  // 防止重复发送
  const submittedMessagesRef = useRef(new Set<string>());

  // 用于滚动到底部的引用
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 使用统一的聊天 hook
  const {
    items,
    isRequesting,
    isFileUploadEnabled,
    attachedFiles,
    handleSubmit,
    handleRetry,
    setIsFileUploadEnabled,
    setAttachedFiles,
  } = useChat(conversationId);

  // 在组件挂载时，如果有来自landing页面的输入内容，同步到本地状态
  useEffect(() => {
    // 只在第一次加载时同步，避免覆盖用户正在输入的内容
    if (inputtingContent && !hasHandledInitialMessageRef.current) {
      console.log("同步初始输入内容到本地状态:", inputtingContent);
      setLocalInputValue(inputtingContent);
      hasHandledInitialMessageRef.current = true;
    }
  }, [inputtingContent]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // 在组件加载和消息更新后滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [items, scrollToBottom]);

  // 处理输入变化，只更新本地状态
  const handleInputChange = (value: string) => {
    setLocalInputValue(value);
  };

  // 处理消息提交
  const handleMessageSubmit = (content: string) => {
    if (!content.trim()) return;

    // 检查是否已提交过相同内容的消息
    const messageKey = `${content.trim()}_${Date.now()}`;
    if (submittedMessagesRef.current.has(messageKey)) {
      console.log("消息已提交，跳过:", content);
      return;
    }
    submittedMessagesRef.current.add(messageKey);

    // 清空本地输入
    setLocalInputValue("");

    // 发送消息
    console.log("提交用户消息:", content);
    handleSubmit(content);

    // 手动消息提交后，标记初始消息已处理，避免重复处理
    hasHandledInitialMessageRef.current = true;
  };

  // 组件卸载时清除资源
  useEffect(() => {
    return () => {
      // 清除任何可能的资源
      submittedMessagesRef.current.clear();
    };
  }, []);

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

  // 创建操作按钮区域
  const actionButtonsNode = (
    <div className={styles.actionButtons}>
      {actionButtonConfig.map((button) => (
        <div
          key={button.key}
          className={`${styles.actionButton} ${styles[button.styleClass]} ${
            communicateTypes[button.key] ? `${styles.activeButton} active` : ""
          }`}
          onClick={() => {
            updateCommunicateTypes({
              ...communicateTypes,
              [button.key]: !communicateTypes[button.key],
            });
          }}
        >
          {button.icon}
          <span>{button.label}</span>
        </div>
      ))}
    </div>
  );

  // 创建附件上传区域
  const senderHeader = (
    <Sender.Header
      title="附件"
      open={isFileUploadEnabled}
      onOpenChange={setIsFileUploadEnabled}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        accept=".jpg, .jpeg, .png, .webp"
        maxCount={1}
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === "drop"
            ? { title: "拖放文件到这里" }
            : {
                icon: <CloudUploadOutlined />,
                title: "上传文件",
                description: "点击或拖拽文件到此区域上传",
              }
        }
      />
    </Sender.Header>
  );

  // 创建附件按钮
  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !isFileUploadEnabled}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        disabled={
          !!communicateTypes.onlineSearch || !!communicateTypes.deepThink
        }
        onClick={() => setIsFileUploadEnabled(!isFileUploadEnabled)}
      />
    </Badge>
  );

  // 创建消息底部控件
  const createMessageFooter = (value: string, isLast: boolean) => (
    <Space size={token.paddingXXS}>
      {isLast && (
        <Button
          color="default"
          variant="text"
          size="small"
          onClick={handleRetry}
          icon={<SyncOutlined />}
        />
      )}
      <Button
        color="default"
        variant="text"
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(value);
        }}
        icon={<CopyOutlined />}
      />
    </Space>
  );

  return (
    <div className={styles.container}>
      <div ref={messagesContainerRef} className={styles.messagesContainer}>
        <Bubble.List
          items={items.map((item, index) => ({
            ...item,
            footer:
              item.role === "ai" || item.role === "aiHistory"
                ? createMessageFooter(item.content, index === items.length - 1)
                : undefined,
          }))}
          className={styles.messages}
        />
      </div>

      <div className={`${styles.chatPageSender} ${styles.senderContainer}`}>
        {actionButtonsNode}
        <div>
          <Sender
            value={localInputValue}
            header={senderHeader}
            onSubmit={handleMessageSubmit}
            allowSpeech
            onChange={handleInputChange}
            prefix={attachmentsNode}
            loading={isRequesting}
            className={styles.sender}
            placeholder={"您可以问我任何问题..."}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatConversationView;
