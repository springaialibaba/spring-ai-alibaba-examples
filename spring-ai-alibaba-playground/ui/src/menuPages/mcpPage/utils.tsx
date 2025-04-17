import {
  BulbOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  FireOutlined,
  GithubOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  SafetyOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { McpServerFormatted, McpServerResponse } from "./types";
import React from "react";
import { MOCK_SERVER_RESPONSE, MOCK_MCP_SERVERS, GITHUB_TOOLS } from "./const";

// 图标组件映射
export const name2iconMap: Record<string, React.ReactNode> = {
  GithubOutlined: <GithubOutlined />,
  EnvironmentOutlined: <EnvironmentOutlined />,
  SearchOutlined: <SearchOutlined />,
  CloudOutlined: <CloudOutlined />,
  BulbOutlined: <BulbOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
  RobotOutlined: <RobotOutlined />,
  PictureOutlined: <PictureOutlined />,
  SafetyOutlined: <SafetyOutlined />,
  FireOutlined: <FireOutlined />,
  Default: <CloudOutlined />,
};

/**
 * 获取服务名称对应的图标名称
 * TODO: 确认服务命名规则
 */
export const getIconNameByServerName = (serverName: string): string => {
  const iconMapping: Record<string, string> = {
    GitHub: "GithubOutlined",
    高德地图: "EnvironmentOutlined",
    Tavily搜索: "SearchOutlined",
    AWS知识库检索: "CloudOutlined",
    浮墨笔记: "CloudOutlined",
  };

  return iconMapping[serverName] || "Default";
};

/**
 * TODO: 后续接入真实API
 */
export const requestMcpServerList = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_SERVER_RESPONSE;
};

/**
 * TODO: 和后端确认数据结构，params中的value当作表单类型
 */
export const formatMcpServerListData = (
  responseData: any
): McpServerFormatted => {
  const { id, name, desc, toolList } = responseData;

  const iconName = getIconNameByServerName(name);

  const tools = toolList.map((tool: any) => ({
    id: tool.name.toLowerCase().replace(/\s+/g, "_"),
    name: tool.name,
    description: tool.desc,
    params: tool.params,
  }));

  return {
    id,
    name,
    icon: iconName,
    description: desc,
    tools,
  };
};

/**
 * 将MCP服务器数据从后端格式转为UI格式
 * 用于将const.ts中的mock数据转为UI所需格式
 */
export const convertMockServersToUiFormat = () => {
  return MOCK_MCP_SERVERS.map((server) => ({
    ...server,
    // 保持返回格式一致性
    tools: GITHUB_TOOLS,
  }));
};

/**
 * 生成表单字段配置
 */
export const generateFormFields = (params: Record<string, string>) => {
  return Object.entries(params).map(([key, value]) => {
    const fieldType = value.toLowerCase().includes("password")
      ? "password"
      : "text";

    return {
      key,
      label: key,
      fieldType,
      placeholder: value || `Enter ${key}`,
      required: true,
    };
  });
};
