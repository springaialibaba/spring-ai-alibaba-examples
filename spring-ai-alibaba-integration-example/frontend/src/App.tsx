import {
  Attachments,
  Bubble,
  Conversations,
  ConversationsProps,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat
} from "@ant-design/x";
import React, { useEffect } from "react";
import {
  CloudUploadOutlined,
  CommentOutlined,
  DeleteOutlined,
  LinkOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  SmileOutlined,
  GithubOutlined,
  RobotFilled,
  UserOutlined,
  ExclamationCircleFilled
} from "@ant-design/icons";
import {
  message,
  Image,
  Badge,
  Button,
  Space,
  Typography,
  Tag,
  Tooltip,
  Select,
  Modal,
  Radio,
  type GetProp
} from "antd";
import ReactMarkdown from "react-markdown";
import { getChat, getModels } from "./request";
import { useStyle } from "./style";
import { litFileSize } from "./utils";

const DEFAULT_MODEL = "qwen-plus";
const MAX_IMAGE_SIZE = 2048;

const decoder = new TextDecoder("utf-8");

// 标记创建的下一个会话的 index
let conversationFlag = 2;

// 用于临时保存会话记录
const conversationsMap: Record<
  string,
  {
    model: string;
    messages: any[];
    params: { onlinSearch: boolean; deepThink: boolean };
  }
> = {};

// 用于临时保存图片的 base64 字符串
let nowImageBase64 = "";

// 默认会话
const defaultKey = Date.now().toString();
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
    )
  }
];

// 会话初始展示
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
        description: `Build a chatbot using Spring Ai Alibaba?`
      },
      {
        key: "2-2",
        icon: <SmileOutlined />,
        description: `How to use RAG in Spring Ai Alibaba?`
      },
      {
        key: "2-3",
        icon: <CommentOutlined />,
        description: `What are best practices for using Spring Ai Alibaba?`
      }
    ]
  },
  {
    key: "2",
    label: renderTitle(<FireOutlined style={{ color: "#FF4D4F" }} />, "Q&A"),
    description: "",
    children: [
      {
        key: "1-1",
        description: `Does Spring AI Alibaba support workflow and multi-agent?`
      },
      {
        key: "1-2",
        description: `The relation between Spring AI and Spring AI Alibaba?`
      },
      {
        key: "1-3",
        description: `Where can I contribute?`
      }
    ]
  }
];

// 会话中角色列表
const aiConfig = {
  placement: "start" as "start" | "end",
  avatar: {
    icon: <RobotFilled />
  },
  styles: {
    content: {
      borderRadius: 16
    }
  },
  messageRender: (content) => (
    <Typography>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Typography>
  )
};
const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    typing: { step: 5, interval: 20 },
    ...aiConfig
  },
  aiHistory: {
    ...aiConfig
  },
  local: {
    placement: "end",
    variant: "shadow",
    avatar: {
      icon: <UserOutlined />
    }
  },
  file: {
    placement: "end",
    variant: "borderless",
    messageRender: (base64: string) => {
      return (
        <Image src={base64} style={{ maxHeight: 250, paddingRight: 32 }} />
      );
    },
    avatar: <></>
  }
};

const Independent: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
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

  // 上传的文件列表
  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, "items">
  >([]);

  // 当前会话交互模式
  const [communicateType, setCommunicateType] = React.useState("");

  // 当前会话的模型
  const [model, setModel] = React.useState(DEFAULT_MODEL);
  // 将要新增会话的模型
  const [nextModel, setNextModel] = React.useState(DEFAULT_MODEL);

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate }) => {
      let buffer = "";
      onUpdate(JSON.stringify({ role: "ai", value: "" }));

      const res = await getChat(
        JSON.parse(message || "{}")?.value || "",
        (value) => {
          buffer = buffer + decoder.decode(value);
          onUpdate(JSON.stringify({ role: "ai", value: buffer }));
        },
        {
          image: attachedFiles?.[0]?.originFileObj,
          chatId: activeKey,
          model,
          deepThink: communicateType === "deepThink",
          onlineSearch: communicateType === "onlineSearch"
        }
      );

      let value: string;
      if (res?.status === 200) {
        value = buffer;
      } else {
        value =
          "Request failed." + (res?.statusText ? " " + res?.statusText : "");
      }

      onSuccess(JSON.stringify({ role: "ai", value }));
    },
    customParams: [attachedFiles, communicateType, activeKey]
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
          )
        }))
      );
    });
  }, []);

  const [items, setItems] = React.useState<
    GetProp<typeof Bubble.List, "items">
  >([]);

  const { onRequest, messages, setMessages } = useXChat({
    agent
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
              base64: nowImageBase64
            }
          }),
          status: "success"
        }
      ]);
    }
    onRequest(
      JSON.stringify({
        role: "local",
        value: nextContent
      })
    );
    setContent("");
  };

  const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
    onRequest(
      JSON.stringify({
        role: "local",
        value: info.data.description
      })
    );
  };

  // 将模型返回的消息的 role 转换成历史记录，避免切换会话触发渲染动效
  const getMessageHistory = () => {
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
        )
      }
    ]);
    conversationFlag = conversationFlag + 1;
    conversationsMap[activeKey] = {
      model,
      messages: getMessageHistory(),
      params: {
        onlinSearch: communicateType === "onlineSearch",
        deepThink: communicateType === "deepThink"
      }
    };
    setHeaderOpen(false);
    setAttachedFiles([]);
    setActiveKey(newKey);
    setMessages([]);
    setModel(nextModel);
    setCommunicateType("");
  };

  // 切换会话
  const onConversationClick: GetProp<typeof Conversations, "onActiveChange"> = (
    key
  ) => {
    conversationsMap[activeKey] = {
      model,
      messages: getMessageHistory(),
      params: {
        onlinSearch: communicateType === "onlineSearch",
        deepThink: communicateType === "deepThink"
      }
    };
    setHeaderOpen(false);
    setAttachedFiles([]);
    setActiveKey(key);
    setMessages(conversationsMap[key].messages || []);
    setModel(conversationsMap[key].model || DEFAULT_MODEL);
    let type: string;
    if (conversationsMap[key].params.onlinSearch) {
      type = "onlineSearch";
    } else if (conversationsMap[key].params.deepThink) {
      type = "deepThink";
    } else {
      type = "";
    }
    setCommunicateType(type);
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
        let type: string;
        if (conversationsMap[activeKey].params.onlinSearch) {
          type = "onlineSearch";
        } else if (conversationsMap[activeKey].params.deepThink) {
          type = "deepThink";
        } else {
          type = "";
        }
        setCommunicateType(type);
        setConversationsItems(newConversationsItems);
      }
    });
  };
  const menuConfig: ConversationsProps["menu"] = (conversation) => ({
    items: [
      {
        label: "Delete",
        key: "delete",
        icon: <DeleteOutlined />,
        danger: true
      }
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
    }
  });

  // ==================== Nodes ====================
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
            width: "100%"
          },
          item: {
            flex: 1
          }
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  // messages 转 items
  useEffect(() => {
    setItems(
      messages.map(({ id, message }) => {
        const item = JSON.parse(message || "{}");
        if (item?.role === "file") {
          const value = item?.value;
          return {
            key: id,
            role: item?.role,
            loading: !value,
            content: value?.base64
          };
        } else {
          const value = item?.value;
          return {
            key: id,
            role: item?.role,
            loading: !value,
            content: value
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
        disabled={!!communicateType}
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
          padding: 0
        }
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
                description: "Click or drag files to this area to upload"
              }
        }
      />
    </Sender.Header>
  );

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Spring AI Alibaba</span>
    </div>
  );

  // ==================== Render =================
  return (
    <>
      <Space className={styles.linkWrapper}>
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
        <Tooltip title={"spring-ai-alibabad-docs link "}>
          <a
            href="https://sca.aliyun.com/en/ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button icon={<LinkOutlined />} />
          </a>
        </Tooltip>
      </Space>
      <div className={styles.layout}>
        <div className={styles.menu}>
          {/* 🌟 Logo */}
          {logoNode}
          {/* 🌟 模型选择 */}
          <div className={styles.chooseModel}>
            select model type
            <Select
              onChange={setNextModel}
              options={modelItems}
              style={{ width: 120 }}
              value={nextModel}
            />
          </div>
          {/* 🌟 添加会话 */}
          <Button
            onClick={onAddConversation}
            type="link"
            className={styles.addBtn}
            icon={<PlusOutlined />}
          >
            New Conversation
          </Button>
          {/* 🌟 会话管理 */}
          <Conversations
            items={conversationsItems}
            className={styles.conversations}
            activeKey={activeKey}
            menu={menuConfig}
            onActiveChange={onConversationClick}
          />
        </div>
        <div className={styles.chat}>
          {/* 🌟 消息列表 */}
          <Bubble.List
            items={
              items.length > 0
                ? items
                : [{ content: placeholderNode, variant: "borderless" }]
            }
            roles={roles}
            className={styles.messages}
          />
          {/* 🌟 输入框 */}
          <Sender
            value={content}
            header={senderHeader}
            onSubmit={onSubmit}
            allowSpeech
            onChange={setContent}
            prefix={attachmentsNode}
            loading={agent.isRequesting()}
            className={styles.sender}
            placeholder={"You can ask me any questions..."}
          />
          {/* 🌟 交互方式 */}
          <Radio.Group
            value={communicateType}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button
              value="onlineSearch"
              onClick={(e: any) => {
                if (e.target.value === communicateType) {
                  setCommunicateType("");
                } else {
                  setCommunicateType(e.target.value);
                }
              }}
            >
              Online search
            </Radio.Button>
            <Tooltip title="Only support deepseek-r1">
              <Radio.Button
                value="deepThink"
                onClick={(e: any) => {
                  if (e.target.value === communicateType) {
                    setCommunicateType("");
                  } else {
                    setCommunicateType(e.target.value);
                  }
                }}
              >
                Deep Think
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
        </div>
      </div>
    </>
  );
};

export default Independent;
