import {
  DeleteOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckOutlined,
  CloseOutlined,
  FormOutlined,
  DingdingOutlined,
} from "@ant-design/icons";
import {
  Button,
  message,
  Select,
  Space,
  Typography,
  Input,
  Tooltip,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useStyle } from "./style";
import { useModelConfigContext } from "../../../stores/modelConfig.store";
import {
  Conversation,
  useConversationContext,
} from "../../../stores/conversation.store";
import { functionMenuItems } from "./const";
import { useFunctionMenuStore } from "../../../stores/functionMenu.store";
import { useNavigate } from "react-router-dom";

export interface ConversationItem {
  key: string;
  label: React.ReactNode;
}

const FunctionMenu = () => {
  const { styles } = useStyle();
  const { menuCollapsed, toggleMenuCollapsed } = useFunctionMenuStore();
  const {
    conversations,
    activeConversation,
    chooseActiveConversation,
    deleteConversation,
    updateConversations,
    clearActiveConversation,
    updateConversationTitle,
  } = useConversationContext();
  const { initModelOptionList, modelOptionList, chooseModel, currentModel } =
    useModelConfigContext();
  const { chooseActiveMenuPage } = useFunctionMenuStore();
  const navigate = useNavigate();
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const [editingTitle, setEditingTitle] = useState("");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    initModelOptionList();
  }, []);

  const onAddConversation = (conversation: Conversation) => {
    updateConversations([...conversations, conversation]);
  };

  const onConversationClick = (conversationId: string) => {
    try {
      if (editingConversationId && editingConversationId !== conversationId) {
        setEditingConversationId(null);
      }

      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );

      if (conversation) {
        // 先清除activeConversation，强制触发重新渲染
        if (activeConversation?.id !== conversationId) {
          clearActiveConversation();
        }

        chooseActiveMenuPage(conversation.type);

        chooseActiveConversation(conversationId);

        const path = `/${conversation.type}/${conversationId}`;
        navigate(path);
      }
    } catch (error) {
      console.error("处理会话点击出错:", error);
    }
  };

  const handleNewChat = () => {
    clearActiveConversation();
    navigate("/chat");
  };

  // 编辑会话标题
  const startEditingTitle = (
    conversation: Conversation,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingConversationId(conversation.id);
    setEditingTitle(conversation.title);
    // 等待 DOM 更新后聚焦输入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
  };

  const saveTitle = (conversationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editingTitle.trim()) {
      updateConversationTitle(conversationId, editingTitle.trim());
    }
    setEditingConversationId(null);
  };

  const cancelEditing = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingConversationId(null);
  };

  // 处理输入框按键事件
  const handleKeyDown = (conversationId: string, e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      saveTitle(conversationId);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <>
      {menuCollapsed && (
        <Button
          className={styles.collapsedMenuBtn}
          type="primary"
          shape="circle"
          icon={<MenuUnfoldOutlined />}
          onClick={toggleMenuCollapsed}
        />
      )}
      <div className={`${menuCollapsed ? styles.menuCollapsed : styles.menu}`}>
        {/* 🌟 顶部信息 */}
        <div className={styles.userProfile}>
          <Space align="center">
            <img src="/logo.svg" alt="Spring AI Alibaba PlayGround" />
          </Space>
          <Button
            type="text"
            icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleMenuCollapsed}
          />
        </div>

        {/* 🌟 功能菜单 */}
        <div className={styles.functionMenu}>
          {functionMenuItems.map((item) => {
            return (
              item.render?.({
                item,
                onAddConversation,
                chooseActiveMenuPage: () => {
                  clearActiveConversation();
                  navigate(`/${item.key}`);
                },
                styles,
                handleNewChat,
              }) || (
                <div
                  key={item.key}
                  className={styles.functionMenuItem}
                  onClick={() => {
                    clearActiveConversation();
                    navigate(`/${item.key}`);
                  }}
                >
                  <Space>
                    {item.icon}
                    <span>{item.label}</span>
                  </Space>
                </div>
              )
            );
          })}
        </div>

        {/* 🌟 模型选择 */}
        <div className={styles.chooseModel}>
          <Typography.Text>模型选择</Typography.Text>
          <Select
            onChange={(value) => chooseModel(value)}
            options={modelOptionList}
            style={{ width: "100%" }}
            value={currentModel?.value}
          />
        </div>
        <div className={styles.conversationsContainer}>
          <Typography.Text>对话历史</Typography.Text>
          <div className={styles.conversationsScrollContainer}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`${styles.conversationItem} ${
                  activeConversation?.id === conversation.id ? "active" : ""
                }`}
                onClick={() => onConversationClick(conversation.id)}
              >
                {/* 编辑模式 */}
                {editingConversationId === conversation.id ? (
                  <div
                    className={styles.titleEditContainer}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      ref={inputRef}
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(conversation.id, e)}
                      className={styles.titleInput}
                      size="small"
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      className={styles.titleEditButton}
                      onClick={(e) => saveTitle(conversation.id, e)}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      className={styles.titleEditButton}
                      onClick={cancelEditing}
                    />
                  </div>
                ) : (
                  <>
                    <span className={styles.conversationTitle}>
                      {conversation.title}
                    </span>
                    <div
                      className={styles.actionButtonsContainer}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="text"
                        className={styles.editButton}
                        icon={<EditOutlined />}
                        onClick={(e) => startEditingTitle(conversation, e)}
                      />
                      <Button
                        type="text"
                        danger
                        className={styles.deleteButton}
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (conversations.length <= 1) {
                            message.info("至少需要保留一个会话");
                            return;
                          }

                          if (activeConversation?.id === conversation.id) {
                            const type = activeConversation.type;
                            navigate(`/${type}`);
                            setTimeout(
                              () => deleteConversation(conversation.id),
                              100
                            );
                          } else {
                            deleteConversation(conversation.id);
                          }
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <Space className={styles.bottomLinkWrapper}>
          <Tooltip title={"Question Feedback"}>
            <a
              href="https://github.com/springaialibaba/spring-ai-alibaba-examples/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={<FormOutlined />} />
            </a>
          </Tooltip>
          <Tooltip title={"Contact Us"}>
            <a target="_blank" rel="noopener noreferrer">
              <Button icon={<DingdingOutlined />} />
            </a>
          </Tooltip>
        </Space>
      </div>
    </>
  );
};

export default FunctionMenu;
