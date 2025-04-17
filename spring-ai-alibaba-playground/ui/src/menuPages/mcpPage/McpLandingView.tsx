import { Input, Button, Tabs, message, theme, Form, Spin } from "antd";
import { ExportOutlined, CopyOutlined } from "@ant-design/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  MOCK_MCP_SERVERS,
  GITHUB_TOOLS,
  DEFAULT_TOKEN_PLACEHOLDER,
  MOCK_SERVER_CONFIG,
} from "./const";
import {
  requestMcpServerList,
  formatMcpServerListData,
  generateFormFields,
  name2iconMap,
} from "./utils";
import { McpServerFormatted, McpToolFormatted } from "./types";
import { useStyles } from "./style";
import React, { useState, useEffect } from "react";

const { TabPane } = Tabs;
const { Item: FormItem } = Form;

const McpLandingView = () => {
  const { styles } = useStyles();
  const [isFetchingServers, setIsFetchingServers] = useState(false);
  const [isExecutingTool, setIsExecutingTool] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [selectedServer, setSelectedServer] = useState("github");
  const [selectedTool, setSelectedTool] = useState("");
  const [githubToken, setGithubToken] = useState(DEFAULT_TOKEN_PLACEHOLDER);
  const [activeTab, setActiveTab] = useState("stdio");
  const [form] = Form.useForm();

  const [serverList, setServerList] = useState<McpServerFormatted[]>([]);
  const [currentServer, setCurrentServer] = useState<McpServerFormatted | null>(
    null
  );
  const [currentTool, setCurrentTool] = useState<McpToolFormatted | null>(null);
  const [formFields, setFormFields] = useState<any[]>([]);

  useEffect(() => {
    const loadServers = async () => {
      setIsFetchingServers(true);
      try {
        // TODO: 目前这是 MOCK 的
        const serverData = await requestMcpServerList();
        const parsedData = formatMcpServerListData(serverData);

        setServerList([parsedData]);
        setCurrentServer(parsedData);
      } catch (error) {
        console.error("Error loading MCP servers:", error);
        message.error("Failed to load MCP servers");
      } finally {
        setIsFetchingServers(false);
      }
    };

    loadServers();
  }, []);

  useEffect(() => {
    if (currentServer && selectedTool) {
      const tool = currentServer.tools.find((t) => t.id === selectedTool);
      if (tool) {
        setCurrentTool(tool);
        const fields = generateFormFields(tool.params);
        setFormFields(fields);
        form.resetFields();
      }
    }
  }, [selectedTool, currentServer, form]);

  const getIconByName = (iconName: string): React.ReactNode => {
    return name2iconMap[iconName] || name2iconMap.Default;
  };

  const handleServerChange = (value: string) => {
    setSelectedServer(value);
    setSelectedTool("");

    const server = serverList.find((s) => s.id === value);
    if (server) {
      setCurrentServer(server);
    }
  };

  const handleToolChange = (value: string) => {
    setSelectedTool(value);
  };

  const handleConnect = () => {
    console.log("Connecting with token:", githubToken);
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(MOCK_SERVER_CONFIG);
    message.success("Configuration copied to clipboard");
  };

  const serverDescription =
    MOCK_MCP_SERVERS.find((server) => server.id === selectedServer)
      ?.description || "";

  const selectedServerIcon =
    MOCK_MCP_SERVERS.find((server) => server.id === selectedServer)?.icon ||
    "CloudOutlined";

  const handleFormSubmit = async (values: any) => {
    if (!currentServer || !currentTool) return;

    setIsExecutingTool(true);
    setExecutionResult(null);

    try {
      // TODO: 调用
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // console.log("Parameters:", values);
      // setExecutionResult(mockResult);
      // message.success(`Successfully executed ${currentTool.name}`);
    } catch (error) {
      console.error("调用失败", error);
      message.error("调用失败");
      setExecutionResult({
        success: false,
        error: String(error),
      });
    } finally {
      setIsExecutingTool(false);
    }
  };

  const toolsToDisplay = currentServer?.tools || GITHUB_TOOLS;

  // 添加动态生成客户端列表的代码
  const clientIconNames = [
    "CodeOutlined",
    "EditOutlined",
    "ThunderboltOutlined",
    "StarOutlined",
    "DesktopOutlined",
    "CommentOutlined",
    "ApiOutlined",
    "MessageOutlined",
  ];

  const clientNames = [
    "VS Code",
    "Cursor",
    "Windsurf",
    "Claude",
    "Cline",
    "ChatWise",
    "Cherry Studio",
    "DeepChat",
  ];

  const availableClients = clientNames.map((name, index) => ({
    name,
    icon: getIconByName(clientIconNames[index]),
  }));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.selectionPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>MCP Servers</span>
          </div>
          <div className={styles.serverList}>
            {MOCK_MCP_SERVERS.map((server) => (
              <div
                key={server.id}
                className={`${styles.serverItem} ${
                  selectedServer === server.id ? styles.serverItemSelected : ""
                }`}
                onClick={() => handleServerChange(server.id)}
              >
                <span className={styles.serverIcon}>
                  {getIconByName(server.icon)}
                </span>
                <span className={styles.serverName}>{server.name}</span>
                <ExportOutlined className={styles.serverArrow} />
              </div>
            ))}
          </div>
        </div>

        {/* 中间栏 */}
        <div className={styles.toolsPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.serverInfo}>
              <span className={styles.serverIcon}>
                {getIconByName(selectedServerIcon)}
              </span>
              <span className={styles.serverName}>{selectedServer}</span>
            </div>
          </div>
          <div className={styles.serverDescription}>{serverDescription}</div>

          <div className={styles.toolsSection}>
            <div className={styles.sectionTitle}>Tools</div>
            <div className={styles.toolsList}>
              {toolsToDisplay.map((tool) => (
                <div
                  key={tool.id}
                  className={`${styles.toolItem} ${
                    selectedTool === tool.id ? styles.toolItemSelected : ""
                  }`}
                  onClick={() => handleToolChange(tool.id)}
                >
                  <span className={styles.toolName}>{tool.name}</span>
                  <ExportOutlined className={styles.toolArrow} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右边栏 */}
        <div className={styles.connectPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              {currentTool ? `使用 ${currentTool.name}` : "连接 MCP 服务器"}
            </span>
          </div>

          {currentTool ? (
            <div className={styles.toolFormContainer}>
              <div className={styles.toolDescription}>
                {currentTool.description}
              </div>

              <Form
                form={form}
                layout="vertical"
                className={styles.toolForm}
                onFinish={handleFormSubmit}
              >
                {formFields.map((field) => (
                  <FormItem
                    key={field.key}
                    label={field.label}
                    name={field.key}
                    rules={[
                      {
                        required: field.required,
                        message: `请输入${field.label}`,
                      },
                    ]}
                  >
                    <Input
                      type={field.fieldType}
                      placeholder={field.placeholder}
                    />
                  </FormItem>
                ))}

                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.submitButton}
                    loading={isExecutingTool}
                  >
                    执行
                  </Button>
                </FormItem>
              </Form>

              {executionResult && (
                <div className={styles.executionResult}>
                  <div className={styles.resultHeader}>
                    <span
                      className={
                        executionResult.success
                          ? styles.successHeader
                          : styles.errorHeader
                      }
                    >
                      {executionResult.success ? "执行成功" : "执行失败"}
                    </span>
                  </div>
                  <div className={styles.resultContent}>
                    {executionResult.success ? (
                      <pre>{JSON.stringify(executionResult.data, null, 2)}</pre>
                    ) : (
                      <div className={styles.errorMessage}>
                        {executionResult.error}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className={styles.connectTabs}
            >
              <TabPane tab="Stdio" key="stdio">
                <div className={styles.configContainer}>
                  <div className={styles.configCode}>
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: "16px",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        borderRadius: "8px",
                        position: "relative",
                      }}
                      showLineNumbers={true}
                      wrapLines={true}
                    >
                      {MOCK_SERVER_CONFIG}
                    </SyntaxHighlighter>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      className={styles.copyButton}
                      onClick={handleCopyConfig}
                    />
                  </div>
                </div>
                <div className={styles.clientsSection}>
                  <h3 className={styles.clientsTitle}>Available Clients</h3>
                  <div className={styles.clientsList}>
                    {availableClients.map((client, index) => (
                      <div key={index} className={styles.clientItem}>
                        <span className={styles.clientIcon}>{client.icon}</span>
                        <span className={styles.clientName}>{client.name}</span>
                        <ExportOutlined className={styles.clientArrow} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Streamable HTTP" key="streamable">
                <div className={styles.tokenInputSection}>
                  <div className={styles.tokenLabel}>
                    GITHUB_PERSONAL_ACCESS_TOKEN
                  </div>
                  <Input
                    className={styles.tokenInput}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder={DEFAULT_TOKEN_PLACEHOLDER}
                  />
                  <Button
                    type="primary"
                    className={styles.connectButton}
                    onClick={handleConnect}
                  >
                    连接
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          )}
        </div>
      </div>

      {/* 加载中 */}
      {isFetchingServers && (
        <div className={styles.loadingOverlay}>
          <Spin size="large" />
          <div className={styles.loadingText}>Loading MCP Servers...</div>
        </div>
      )}
    </div>
  );
};

export default McpLandingView;
