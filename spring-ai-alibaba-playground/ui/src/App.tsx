import {
  LinkOutlined,
  GithubOutlined,
  FormOutlined,
  DingdingOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { Button, Tooltip, Layout, theme, ConfigProvider, App as AntdApp } from "antd";
import { useStyle } from "./style";
import { Space } from "antd";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { pageComponents } from "./constant";
import FunctionMenu from "./menuPages/components/FunctionMenu";
import { useTheme } from "./hooks/useTheme";
import { ThemeProvider } from "antd-style";

// 定义深色主题和浅色主题的算法
import darkAlgorithm from 'antd/es/theme/themes/dark';
import defaultAlgorithm from 'antd/es/theme/themes/default';

// 创建自定义主题配置
const customTheme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
  },
};

const Independent: React.FC = () => {
  const { actualTheme, toggleTheme } = useTheme();
  const { token } = theme.useToken();
  const { styles } = useStyle();
  const isDark = actualTheme === 'dark';
  
  // 根据当前主题设置body背景色
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#141414' : '#ffffff';
    
    // 如果是暗色主题，添加class
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  // ==================== Render =================
  return (
    <>
      <Space className={styles.topLinkWrapper}>
        <Tooltip title={isDark ? "切换到亮色模式" : "切换到暗色模式"}>
          <Button
            className="theme-toggle-btn"
            icon={isDark ? <BulbFilled /> : <BulbOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>
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
        {/* 左侧菜单不应用过渡效果 */}
        <FunctionMenu />
        {/* 菜单页面容器 */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            {Object.entries(pageComponents).map(([key, Component]) => (
              <React.Fragment key={key}>
                {/* 类页面路由 */}
                <Route
                  path={`/${key}`}
                  element={
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        transition: "none",
                        backgroundColor: token.colorBgContainer,
                        overflowY: "auto",
                      }}
                    >
                      <Component />
                    </div>
                  }
                />
                {/* 实例页面路由 */}
                <Route
                  path={`/${key}/:conversationId`}
                  element={
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        transition: "none",
                        backgroundColor: token.colorBgContainer,
                        overflowY: "auto",
                      }}
                    >
                      <Component />
                    </div>
                  }
                />
              </React.Fragment>
            ))}
          </Routes>
        </div>

        {/* 页脚始终显示 */}
        <Layout.Footer className={styles.footer}>
          Copyright 2024-2026 By spring-ai-alibaba-community
        </Layout.Footer>
      </div>
    </>
  );
};

const App = () => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <ConfigProvider
      theme={{
        ...customTheme,
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <AntdApp>
        <ThemeProvider
          appearance={actualTheme}
          themeMode={actualTheme}
          theme={customTheme}
        >
          <Router>
            <Independent />
          </Router>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
