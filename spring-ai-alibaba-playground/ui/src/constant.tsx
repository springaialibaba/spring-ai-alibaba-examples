import {
  GlobalOutlined,
  ThunderboltOutlined,
  ReadOutlined,
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  SmileOutlined,
  RobotFilled,
  UserOutlined,
  PlusOutlined,
  PictureOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import React from "react";
import DocSummaryPage from "./menuPages/docSummaryPage";
import FunctionCallingPage from "./menuPages/functionCallingPage";
import ImageGenPage from "./menuPages/ImageGenPage";
import McpPage from "./menuPages/McpPage";
import MultiModalPage from "./menuPages/MultiModalPage";
import RagPage from "./menuPages/RagPage";
import { FunctionMenuItem } from "./types";
import { Bubble, Prompts, Welcome } from "@ant-design/x";
import { Space, GetProp, Tag, message, Typography, Image, Button } from "antd";
import ReactMarkdown from "react-markdown";
import ChatPage from "./menuPages/ChatPage";
import { MenuPage } from "./stores/functionMenu.store";

export const BASE_URL = "/api/v1";
export const DEFAULT_MODEL = "qwen-plus";
export const MAX_IMAGE_SIZE = 2048;

export const pageComponents = {
  [MenuPage.Chat]: ChatPage,
  [MenuPage.ImageGen]: ImageGenPage,
  [MenuPage.DocSummary]: DocSummaryPage,
  [MenuPage.MultiModal]: MultiModalPage,
  [MenuPage.ToolCalling]: FunctionCallingPage,
  [MenuPage.Rag]: RagPage,
  [MenuPage.Mcp]: McpPage,
  // [MenuPage.MoreExamples]: McpPage, // 暂时使用 McpPage 作为占位
} as const;

// 按钮配置列表
export const actionButtonConfig = [
  {
    key: "onlineSearch",
    label: "在线搜索",
    icon: <GlobalOutlined />,
    styleClass: "searchButton",
    baseColor: "#4096ff",
    bgColor: "#e6f4ff",
    activeColor: "#1677ff",
    description: "使用网络搜索获取最新信息",
  },
  {
    key: "deepThink",
    label: "深度思考",
    icon: <ThunderboltOutlined />,
    styleClass: "thinkButton",
    baseColor: "#9254de",
    bgColor: "#f9f0ff",
    activeColor: "#722ed1",
    description: "深度分析问题并给出详细回答",
  },
];

export const functionMenuItems: FunctionMenuItem[] = [
  {
    key: "chat",
    icon: <PlusOutlined />,
    label: "对话",
    render: (props: any) => {
      const { item, styles, handleNewChat } = props;
      return (
        <Button
          key={item?.key}
          onClick={handleNewChat}
          type="primary"
          className={styles.newChatBtn}
          icon={<PlusOutlined />}
          block
        >
          新对话
        </Button>
      );
    },
  },
  {
    key: "image-gen",
    icon: <PictureOutlined />,
    label: "图像生成",
  },
  {
    key: "doc-summary",
    icon: <ReadOutlined />,
    label: "文档总结",
  },
  // {
  //   key: "multi-modal",
  //   icon: <PictureOutlined />,
  //   label: "多模态",
  // },
  {
    key: "tool-calling",
    icon: <ToolOutlined />,
    label: "Tool Calling",
  },
  {
    key: "rag",
    icon: <DatabaseOutlined />,
    label: "RAG",
  },
  {
    key: "mcp",
    icon: <ApiOutlined />,
    label: "MCP",
  },
  // {
  //   key: "more-examples",
  //   icon: <PhoneOutlined />,
  //   label: "更多案例",
  // },
];

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

export const placeholderPromptsItems: GetProp<typeof Prompts, "items"> = [
  {
    key: "1",
    label: renderTitle(
      <ReadOutlined style={{ color: "#1890FF" }} />,
      "User Guide"
    ),
    description: "",
    children: [
      {
        key: "2-1",
        icon: <HeartOutlined />,
        description: `Build a chatbot using Spring Ai Alibaba?`,
      },
      {
        key: "2-2",
        icon: <SmileOutlined />,
        description: `How to use RAG in Spring Ai Alibaba?`,
      },
      {
        key: "2-3",
        icon: <CommentOutlined />,
        description: `What are best practices for using Spring Ai Alibaba?`,
      },
    ],
  },
  {
    key: "2",
    label: renderTitle(<FireOutlined style={{ color: "#FF4D4F" }} />, "Q&A"),
    description: "",
    children: [
      {
        key: "1-1",
        description: `Does Spring AI Alibaba support workflow and multi-agent?`,
      },
      {
        key: "1-2",
        description: `The relation between Spring AI and Spring AI Alibaba?`,
      },
      {
        key: "1-3",
        description: `Where can I contribute?`,
      },
    ],
  },
];

export const defaultKey = Date.now().toString();
export const defaultConversationsItems = [
  {
    key: defaultKey,
    label: (
      <span>
        Conversation 1
        <Tag style={{ marginLeft: 8 }} color="green">
          {DEFAULT_MODEL}
        </Tag>
      </span>
    ),
  },
];

export const aiConfig = {
  placement: "start" as "start" | "end",
  avatar: {
    icon: <RobotFilled />,
  },
  styles: {
    content: {
      borderRadius: 16,
    },
  },
  messageRender: (content) => (
    <Typography>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Typography>
  ),
};

export const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    typing: { step: 5, interval: 20 },
    ...aiConfig,
  },
  aiHistory: {
    ...aiConfig,
  },
  local: {
    placement: "end",
    variant: "shadow",
    avatar: {
      icon: <UserOutlined />,
    },
  },
  file: {
    placement: "end",
    variant: "borderless",
    messageRender: (base64: string) => {
      return (
        <Image src={base64} style={{ maxHeight: 250, paddingRight: 32 }} />
      );
    },
    avatar: <></>,
  },
};

export const conversationsMap: Record<
  string,
  {
    model: string;
    messages: any[];
    params: { onlineSearch: boolean; deepThink: boolean };
  }
> = {};

// 默认会话界面
export const PlaceholderNode = ({ className, onPromptsItemClick }) => {
  return (
    <Space direction="vertical" size={16} className={className}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Spring Ai Alibaba"
        description="An AI assistant built with Spring AI Alibaba framework, with embedded Spring AI Alibaba domain knowledge using RAG. Supports text and image user input, audio generation, and image generation."
      />
      <Prompts
        title="What do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: "100%",
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );
};
