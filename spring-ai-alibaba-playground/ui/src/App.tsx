import { useEffect, useRef, useState } from "react";
import {
  Attachments,
  Conversations,
  ConversationsProps,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  LinkOutlined,
  PaperClipOutlined,
  PlusOutlined,
  GithubOutlined,
  ExclamationCircleFilled,
  FormOutlined,
  DingdingOutlined,
  SyncOutlined,
  CopyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExpandAltOutlined,
  CompressOutlined,
  SearchOutlined,
  CodeOutlined,
  PictureOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  message,
  Image,
  Badge,
  Button,
  Tooltip,
  Select,
  Modal,
  Layout,
  theme,
} from "antd";
import { getChat, getModels } from "./request";
import { useStyle } from "./style";
import { litFileSize } from "./utils";

import {
  CommentOutlined,
  FireOutlined,
  GlobalOutlined,
  HeartOutlined,
  ReadOutlined,
  RobotFilled,
  SmileOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GetProp, Space, Tag, Typography } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ActionButtonConfig, FunctionMenuItem } from "./types";
import { Bubble } from "@ant-design/x";

// 导入页面组件
import ImageGenPage from "./menuPages/imageGenPage";
import DocSummaryPage from "./menuPages/docSummaryPage";
import MultiModalPage from "./menuPages/multiModalPage";
import FunctionCallingPage from "./menuPages/functionCallingPage";
import RagPage from "./menuPages/ragPage";
import McpPage from "./menuPages/mcpPage";

// 按钮配置列表
export const actionButtonConfig: ActionButtonConfig[] = [
  {
    key: "onlineSearch",
    label: "在线搜索",
    icon: <GlobalOutlined />,
    styleClass: "searchButton",
    activeColor: "#1677ff",
    description: "使用网络搜索获取最新信息",
  },
  {
    key: "deepThink",
    label: "深度思考",
    icon: <ThunderboltOutlined />,
    styleClass: "thinkButton",
    activeColor: "#722ed1",
    description: "深度分析问题并给出详细回答",
  },
];

export const functionMenuItems: FunctionMenuItem[] = [
  {
    key: "image-gen",
    icon: <SearchOutlined />,
    label: "图像生成",
  },
  {
    key: "doc-summary",
    icon: <FormOutlined />,
    label: "文档总结",
  },
  {
    key: "multi-modal",
    icon: <PictureOutlined />,
    label: "多模态",
  },
  {
    key: "function-calling",
    icon: <ReadOutlined />,
    label: "Function Calling",
  },
  {
    key: "rag",
    icon: <CodeOutlined />,
    label: "RAG",
  },
  {
    key: "mcp",
    icon: <PhoneOutlined />,
    label: "MCP",
  },
  {
    key: "more-examples",
    icon: <PhoneOutlined />,
    label: "更多案例",
  },
];

const DEFAULT_MODEL = "qwen-plus";
const MAX_IMAGE_SIZE = 2048;
const decoder = new TextDecoder("utf-8");
// 标记创建的下一个会话的 index
let conversationFlag = 2;
// 标记当前请求是否是重试
let isRetry = false;

// 用于临时保存会话记录
const conversationsMap: Record<
  string,
  {
    model: string;
    messages: any[];
    params: { onlineSearch: boolean; deepThink: boolean };
  }
> = {};
// 默认会话
const defaultKey = Date.now().toString();
// 用于临时保存图片的 base64 字符串
let nowImageBase64 = "";
// 记录每个会话的最后一次请求参数，用于重试
let lastRequestParamsMap: Record<
  string,
  {
    image: File | undefined;
    chatId: string;
    model: string;
    deepThink: boolean;
    onlineSearch: boolean;
  }
> = {};

const defaultConversationsItems = [
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
const aiConfig = {
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
const roles: GetProp<typeof Bubble.List, "roles"> = {
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
const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const placeholderPromptsItems: GetProp<typeof Prompts, "items"> = [
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

// 添加页面组件映射
const pageComponents = {
  "image-gen": ImageGenPage,
  "doc-summary": DocSummaryPage,
  "multi-modal": MultiModalPage,
  "function-calling": FunctionCallingPage,
  rag: RagPage,
  mcp: McpPage,
  "more-examples": McpPage, // 暂时使用 McpPage 作为占位
} as const;

const Independent: React.FC = () => {
  const { token } = theme.useToken();
  // 页面样式
  const { styles } = useStyle();
  // 上传文件 header 是否开启
  const [headerOpen, setHeaderOpen] = React.useState(false);
  const [content, setContent] = React.useState("");
  // 会话列表
  const [conversationsItems, setConversationsItems] = React.useState(
    defaultConversationsItems
  );
  // 当前会话的 key
  const [activeKey, setActiveKey] = React.useState(
    defaultConversationsItems[0].key
  );
  // 需要将会话的 key 包裹一层，防止闭包的时候拿不到
  const activeKeyRef = useRef(activeKey);
  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  // 上传的文件列表
  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, "items">
  >([]);

  // 当前会话交互模式，改为对象形式支持多选
  const [communicateTypes, setCommunicateTypes] = React.useState({
    onlineSearch: false,
    deepThink: false,
  });

  // 当前会话的模型
  const [model, setModel] = React.useState(DEFAULT_MODEL);
  // 将要新增会话的模型
  const [nextModel, setNextModel] = React.useState(DEFAULT_MODEL);

  // 左侧菜单折叠状态
  const [menuCollapsed, setMenuCollapsed] = React.useState(false);

  // 输入框展开状态
  const [senderExpanded, setSenderExpanded] = useState(false);

  // 输入文本长度
  const [textLength, setTextLength] = useState(0);

  // 监听输入文本长度变化
  useEffect(() => {
    setTextLength(content.length);
  }, [content]);

  // 使用useRef来存储当前输入框的展开状态
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);

  // 切换输入框展开状态的函数
  const toggleTextareaExpand = () => {
    const textarea = document.querySelector(
      ".ant-sender-textarea"
    ) as HTMLElement;
    if (textarea) {
      if (isTextareaExpanded) {
        // 如果已经展开，则收起（使用空字符串恢复默认值）
        textarea.style.height = "";
        textarea.style.maxHeight = "";
      } else {
        // 如果收起状态，则展开
        textarea.style.height = "300px";
        textarea.style.maxHeight = "300px";
      }

      // 更新状态以重新渲染图标
      setIsTextareaExpanded(!isTextareaExpanded);
    }
  };

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate }) => {
      let buffer = "";
      onUpdate(JSON.stringify({ role: "ai", value: "" }));

      const requestParams = isRetry
        ? lastRequestParamsMap[activeKey]
        : {
            image: attachedFiles?.[0]?.originFileObj,
            chatId: activeKey,
            model,
            deepThink: communicateTypes.deepThink,
            onlineSearch: communicateTypes.onlineSearch,
          };
      isRetry = false;

      const res = await getChat(
        encodeURIComponent(JSON.parse(message || "{}")?.value || ""),
        (value) => {
          buffer = buffer + decoder.decode(value);

          // 判断是否用户在模型返回前就切换会话
          if (activeKey === activeKeyRef.current) {
            onUpdate(JSON.stringify({ role: "ai", value: buffer }));
          }
        },
        requestParams
      );

      let value: string;
      if (res?.status === 200) {
        value = buffer;
        lastRequestParamsMap[activeKey] = requestParams;
      } else {
        value =
          "Request failed." + (res?.statusText ? " " + res?.statusText : "");
      }

      if (activeKey === activeKeyRef.current) {
        onSuccess(JSON.stringify({ role: "ai", value }));
      } else {
        const messages = conversationsMap[activeKey].messages;
        conversationsMap[activeKey].messages = getMessageHistory([
          ...messages.slice(0, messages.length - 1),
          {
            id: messages.length - 1,
            message: JSON.stringify({ role: "ai", value }),
            status: "success",
          },
        ]);
      }
    },
  });

  // 获取模型列表
  const [modelItems, setModelItems] = React.useState([]);
  useEffect(() => {
    getModels().then((res) => {
      setModelItems(
        res.map(({ model, desc }) => ({
          value: model,
          label: (
            <Tooltip title={desc} placement="right">
              {model}
            </Tooltip>
          ),
        }))
      );
    });
  }, []);

  const [items, setItems] = React.useState<
    GetProp<typeof Bubble.List, "items">
  >([]);

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    setHeaderOpen(false);
    setAttachedFiles([]);
    if (attachedFiles.length > 0) {
      setMessages([
        ...messages,
        {
          id: messages.length,
          message: JSON.stringify({
            role: "file",
            value: {
              base64: nowImageBase64,
            },
          }),
          status: "success",
        },
      ]);
    }
    onRequest(
      JSON.stringify({
        role: "local",
        value: nextContent,
      })
    );
    setContent("");
  };

  const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
    onRequest(
      JSON.stringify({
        role: "local",
        value: info.data.description,
      })
    );
  };

  // 将模型返回的消息的 role 转换成历史记录，避免切换会话触发渲染动效
  const getMessageHistory = (messages: any[]) => {
    return messages.map((item) => {
      const value = JSON.parse(item.message);
      if (value.role === "ai") {
        value.role = "aiHistory";
        item.message = JSON.stringify(value);
        return item;
      } else {
        return item;
      }
    });
  };

  // 新增会话
  const onAddConversation = async () => {
    const newKey = Date.now().toString();
    setConversationsItems([
      ...conversationsItems,
      {
        key: newKey,
        label: (
          <span>
            {`Conversation ${conversationFlag}`}
            <Tag style={{ marginLeft: 8 }} color="green">
              {nextModel}
            </Tag>
          </span>
        ),
      },
    ]);
    conversationFlag = conversationFlag + 1;
    conversationsMap[activeKey] = {
      model,
      messages: getMessageHistory(messages),
      params: {
        onlineSearch: communicateTypes.onlineSearch,
        deepThink: communicateTypes.deepThink,
      },
    };
    setHeaderOpen(false);
    setAttachedFiles([]);
    setActiveKey(newKey);
    setMessages([]);
    setModel(nextModel);
    setCommunicateTypes({ onlineSearch: false, deepThink: false });
    // 清除当前激活的菜单页面，回到聊天列表
    setActiveMenuPage(null);
    // 清除 URL hash
    window.location.hash = "";
  };

  // 切换会话
  const onConversationClick: GetProp<typeof Conversations, "onActiveChange"> = (
    key
  ) => {
    conversationsMap[activeKey] = {
      model,
      messages: getMessageHistory(messages),
      params: {
        onlineSearch: communicateTypes.onlineSearch,
        deepThink: communicateTypes.deepThink,
      },
    };
    setHeaderOpen(false);
    setAttachedFiles([]);
    setActiveKey(key);
    setMessages(conversationsMap[key].messages || []);
    setModel(conversationsMap[key].model || DEFAULT_MODEL);
    setCommunicateTypes({
      onlineSearch: conversationsMap[key].params.onlineSearch,
      deepThink: conversationsMap[key].params.deepThink,
    });
    // 清除当前激活的菜单页面，回到聊天列表
    setActiveMenuPage(null);
    // 清除 URL hash
    window.location.hash = "";
  };

  const handleFileChange: GetProp<typeof Attachments, "onChange"> = (info) => {
    // 检查文件大小是否不符合预期
    if (
      info.fileList?.length > 0 &&
      litFileSize(info.fileList?.[0]?.originFileObj as any, MAX_IMAGE_SIZE)
    ) {
      // 图片转 base64
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target?.result;
        nowImageBase64 = base64String as string;
      };
      reader.readAsDataURL(info.fileList?.[0]?.originFileObj as File);

      setAttachedFiles(info.fileList);
    }

    if (info.fileList?.length === 0) {
      setAttachedFiles(info.fileList);
    }
  };

  // 会话管理功能
  const { confirm } = Modal;
  const confirmDelete = (key: string) => {
    confirm({
      title: "Do you want to delete this conversation?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        const index = conversationsItems.findIndex((item) => {
          return item.key === key;
        });
        const newConversationsItems = conversationsItems.filter((item) => {
          return item.key !== key;
        });
        const nextIndex = Math.min(index, newConversationsItems.length - 1);
        delete conversationsMap[key];
        setHeaderOpen(false);
        setAttachedFiles([]);
        const activeKey = newConversationsItems[nextIndex].key;
        setActiveKey(activeKey);
        setMessages(conversationsMap[activeKey].messages || []);
        setModel(conversationsMap[activeKey].model || DEFAULT_MODEL);
        setCommunicateTypes({
          onlineSearch: conversationsMap[activeKey].params.onlineSearch,
          deepThink: conversationsMap[activeKey].params.deepThink,
        });
        setConversationsItems(newConversationsItems);
      },
    });
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
      if (menuInfo.key === "delete") {
        if (conversationsItems.length === 1) {
          message.info(
            "Can only be deleted if there are multiple conversations"
          );
        } else {
          confirmDelete(conversation.key);
        }
      }
    },
  });

  // 添加页面状态控制
  const [activeMenuPage, setActiveMenuPage] = useState<string | null>(null);

  // 在组件加载时读取 URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveMenuPage(hash);
    }
  }, []);

  // 监听 hash 变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setActiveMenuPage(hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 修改菜单点击处理函数
  const handleFunctionMenuClick = (item: FunctionMenuItem) => {
    if (item.key === "more-examples") return; // 忽略"更多参考案例"

    // 更新 URL hash
    window.location.hash = item.key;
    // 更新当前激活的页面
    setActiveMenuPage(item.key);
  };

  // 自定义左侧菜单组件
  const FunctionMenuItem = ({ item }: { item: FunctionMenuItem }) => (
    <div
      className={styles.functionMenuItem}
      onClick={() => handleFunctionMenuClick(item)}
    >
      <Space>
        {item.icon}
        <span>{item.label}</span>
      </Space>
    </div>
  );

  // 默认会话界面
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
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

  // 消息下的功能区域
  const createMessageFooter = (value: string, isLast: boolean) => (
    <Space size={token.paddingXXS}>
      {isLast && (
        <Button
          color="default"
          variant="text"
          size="small"
          onClick={() => {
            isRetry = true;
            const request = messages[messages.length - 2]?.message;
            setMessages(messages.slice(0, messages.length - 2));
            onRequest(request);
          }}
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

  // messages 转 items
  useEffect(() => {
    setItems(
      messages.map(({ id, message }, index) => {
        const item = JSON.parse(message || "{}");
        const value = item?.value;
        if (item?.role === "file") {
          return {
            key: id,
            role: item?.role,
            loading: !value,
            content: value?.base64,
          };
        } else {
          return {
            key: id,
            role: item?.role,
            loading: !value,
            content: value,
            footer:
              item?.role === "ai" || item?.role === "aiHistory"
                ? createMessageFooter(value, index === messages.length - 1)
                : undefined,
          };
        }
      })
    );
  }, [messages]);

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        disabled={
          !!communicateTypes.onlineSearch || !!communicateTypes.deepThink
        }
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
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
            ? { title: "Drop file here" }
            : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
        }
      />
    </Sender.Header>
  );

  // 切换左侧菜单折叠状态
  const toggleMenuCollapsed = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  // 账户显示组件
  const userProfileNode = (
    <div className={styles.userProfile}>
      <Space align="center">
        <img src="saa_logo.png" alt="Spring AI Alibaba" />
      </Space>
      <Button
        type="text"
        icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleMenuCollapsed}
      />
    </div>
  );

  // 折叠后的悬浮按钮
  const collapsedMenuButton = menuCollapsed && (
    <Button
      className={styles.collapsedMenuBtn}
      type="primary"
      shape="circle"
      icon={<MenuUnfoldOutlined />}
      onClick={toggleMenuCollapsed}
    />
  );

  // 切换输入框展开状态
  const toggleSenderExpand = () => {
    setSenderExpanded(!senderExpanded);
  };

  // 功能按钮组件
  const actionButtonsNode = (
    <div className={styles.actionButtons}>
      {actionButtonConfig.map((button) => (
        <div
          key={button.key}
          className={`${styles.actionButton} ${styles[button.styleClass]} ${
            communicateTypes[button.key] ? `${styles.activeButton} active` : ""
          }`}
          onClick={() => {
            setCommunicateTypes((prev) => ({
              ...prev,
              [button.key]: !prev[button.key],
            }));
          }}
        >
          {button.icon}
          <span>{button.label}</span>
        </div>
      ))}
    </div>
  );

  // 展开/收起输入框按钮
  // const expandToggleButton = textLength > 350 && (
  //   <div
  //     className={styles.expandToggle}
  //     onClick={(e) => {
  //       e.stopPropagation();
  //       toggleTextareaExpand();
  //     }}
  //   >
  //     {isTextareaExpanded ? <CompressOutlined /> : <ExpandAltOutlined />}
  //   </div>
  // );

  // 页面容器的基础样式
  const basePageStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: token.colorBgContainer,
    overflowY: "auto" as const,
  };

  // ==================== Render =================
  return (
    <>
      {menuCollapsed && collapsedMenuButton}
      <Space className={styles.topLinkWrapper}>
        <Tooltip title={"spring-ai-alibaba-examples link"}>
          <a
            href="https://github.com/springaialibaba/spring-ai-alibaba-examples"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button icon={<GithubOutlined />} />
          </a>
        </Tooltip>
        <Tooltip title={"spring-ai-alibaba link"}>
          <a
            href="https://github.com/alibaba/spring-ai-alibaba"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button icon={<GithubOutlined />} />
          </a>
        </Tooltip>
        <Tooltip title={"spring-ai-alibabad-docs link"}>
          <a
            href="https://sca.aliyun.com/en/ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button icon={<LinkOutlined />} />
          </a>
        </Tooltip>
      </Space>
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
      <div className={styles.layout}>
        <div
          className={`${styles.menu} ${
            menuCollapsed ? styles.menuCollapsed : ""
          }`}
        >
          {/* 🌟 面板信息 */}
          {userProfileNode}

          {/* 🌟 新对话按钮 */}
          <Button
            onClick={onAddConversation}
            type="primary"
            className={styles.newChatBtn}
            icon={<PlusOutlined />}
            block
          >
            新对话
          </Button>

          {/* 🌟 功能菜单 */}
          <div className={styles.functionMenu}>
            {functionMenuItems.map((item) => (
              <FunctionMenuItem key={item.key} item={item} />
            ))}
          </div>

          {/* 🌟 模型选择 */}
          <div className={styles.chooseModel}>
            <Typography.Text>模型选择</Typography.Text>
            <Select
              onChange={setNextModel}
              options={modelItems}
              style={{ width: "100%" }}
              value={nextModel}
            />
          </div>

          {/* 🌟 会话管理 */}
          <div className={styles.conversationsContainer}>
            <Typography.Text>对话历史</Typography.Text>
            <Conversations
              items={conversationsItems}
              className={styles.conversations}
              activeKey={activeKey}
              menu={menuConfig}
              onActiveChange={onConversationClick}
            />
          </div>
        </div>
        <div
          className={`${styles.chat} ${
            menuCollapsed ? styles.chatFullWidth : ""
          }`}
        >
          {/* 聊天消息列表 - 只在没有激活菜单页面时显示 */}
          <div
            style={{
              display: !activeMenuPage ? "flex" : "none",
              opacity: !activeMenuPage ? 1 : 0,
              flex: 1,
              flexDirection: "column",
              transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Bubble.List
              items={
                items.length > 0
                  ? items
                  : [{ content: placeholderNode, variant: "borderless" }]
              }
              roles={roles}
              className={styles.messages}
            />
          </div>

          {/* 菜单页面容器 */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {Object.entries(pageComponents).map(([key, Component]) => (
              <div
                key={key}
                style={{
                  ...basePageStyle,
                  display: activeMenuPage === key ? "block" : "none",
                  opacity: activeMenuPage === key ? 1 : 0,
                }}
              >
                <Component />
              </div>
            ))}
          </div>

          {/* 底部输入区域 - 只在聊天页面显示 */}
          {!activeMenuPage && (
            <div>
              {actionButtonsNode}
              <div style={{ position: "relative" }}>
                <Sender
                  value={content}
                  header={senderHeader}
                  onSubmit={onSubmit}
                  allowSpeech
                  onChange={setContent}
                  prefix={attachmentsNode}
                  loading={agent.isRequesting()}
                  className={styles.sender}
                  placeholder={"您可以问我任何问题..."}
                />
              </div>
            </div>
          )}

          {/* 页脚始终显示 */}
          <Layout.Footer className={styles.footer}>
            Copyright 2024-2026 By spring-ai-alibaba-community
          </Layout.Footer>
        </div>
      </div>
    </>
  );
};

export default Independent;
