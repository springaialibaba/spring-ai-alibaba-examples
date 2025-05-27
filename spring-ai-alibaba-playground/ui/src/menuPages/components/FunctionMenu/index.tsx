import {
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, message, Select, Space, Typography } from "antd";
import React, { useEffect } from "react";
import { useStyle } from "../../../style";
import { FunctionMenuItem } from "../../../types";
import { useModelConfigContext } from "../../../stores/modelConfig.store";
import {
  Conversation,
  useConversationContext,
} from "../../../stores/conversation.store";
import { functionMenuItems } from "../../../constant";
import { Conversations, ConversationsProps } from "@ant-design/x";
import { useFunctionMenuStore } from "../../../stores/functionMenu.store";
import { useNavigate } from "react-router-dom";

export interface ConversationItem {
  key: string;
  label: React.ReactNode;
}

export interface MenuProps {}

const FunctionMenu = (props: MenuProps) => {
  const { styles } = useStyle();
  const { menuCollapsed, toggleMenuCollapsed } = useFunctionMenuStore();
  const {
    conversations,
    activeConversation,
    chooseActiveConversation,
    deleteConversation,
    updateConversations,
    clearActiveConversation,
  } = useConversationContext();
  const { initModelOptionList, modelOptionList, chooseModel, currentModel } =
    useModelConfigContext();
  const { updateActiveMenuPage, chooseActiveMenuPage } = useFunctionMenuStore();
  const navigate = useNavigate();

  useEffect(() => {
    initModelOptionList();
  }, []);

  const onAddConversation = (conversation: Conversation) => {
    updateConversations([...conversations, conversation]);
  };

  const onConversationClick = (conversationId: string) => {
    try {
      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );

      if (conversation) {
        console.log(
          "点击切换对话:",
          conversationId,
          "当前对话:",
          activeConversation?.id
        );

        // 先清除activeConversation，强制触发重新渲染
        if (activeConversation?.id !== conversationId) {
          clearActiveConversation();
        }

        // 确保清除当前激活菜单页状态，避免干扰
        chooseActiveMenuPage(conversation.type);

        // 激活选中的会话
        chooseActiveConversation(conversationId);

        // 显式导航到会话页面
        const path = `/${conversation.type}/${conversationId}`;
        console.log("导航到对话:", path);
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

  const menuConfig: ConversationsProps["menu"] = (conversation) => ({
    items: [
      {
        label: "Delete",
        key: "delete",
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      console.log("menuInfo", menuInfo);
      if (menuInfo.key === "delete") {
        if (conversations.length === 1) {
          message.info(
            "Can only be deleted if there are multiple conversations"
          );
        } else {
          deleteConversation(conversation.key);
          // 如果删除的是当前对话，导航到类页面
          if (activeConversation?.id === conversation.key) {
            navigate(`/${activeConversation.type}`);
          }
        }
      }
    },
  });

  console.log("conversations", conversations);

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
      <div
        className={`${styles.menu} ${
          menuCollapsed ? styles.menuCollapsed : ""
        }`}
      >
        {/* 🌟 顶部信息 */}
        <div className={styles.userProfile}>
          <Space align="center">
            <img src="/saa_logo.png" alt="Spring AI Alibaba" />
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
            onChange={chooseModel}
            options={modelOptionList}
            style={{ width: "100%" }}
            value={currentModel}
          />
        </div>
        <div className={styles.conversationsContainer}>
          <Typography.Text>对话历史</Typography.Text>
          <Conversations
            items={conversations.map((item) => {
              return {
                ...item,
                key: item.id,
                label: item.title,
              };
            })}
            className={styles.conversations}
            activeKey={activeConversation?.id}
            menu={menuConfig}
            onActiveChange={(value) => onConversationClick(value)}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default FunctionMenu;
