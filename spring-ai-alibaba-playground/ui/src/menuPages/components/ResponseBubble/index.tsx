import React, { useState, useEffect, useRef } from "react";
import { Button, Space, theme } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useStyle } from "./style";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

interface ResponseBubbleProps {
  content: string;
  timestamp: number;
  isError?: boolean;
  footer?: () => React.ReactNode;
}

// 缓存防止重复
const processedContentCache = new Map<string, string>();

const ResponseBubble: React.FC<ResponseBubbleProps> = ({
  content,
  timestamp,
  isError = false,
  footer = null,
}) => {
  const { token } = theme.useToken();
  const { styles } = useStyle();
  const [processedContent, setProcessedContent] = useState(content);
  const isProcessingRef = useRef(false);
  const messageId = useRef(`${timestamp}`).current;

  const components: Components = {
    blockquote: ({ children }) => (
      <blockquote className={styles.thinkBlock}>{children}</blockquote>
    ),
    code: ({ children, className }) => (
      <code className={styles.codeInline}>{children}</code>
    ),
    pre: ({ children }) => <pre className={styles.codeBlock}>{children}</pre>,
    // TODO: 优化样式
  };

  useEffect(() => {
    const processContent = () => {
      if (isProcessingRef.current) return;
      try {
        isProcessingRef.current = true;

        // 检查缓存
        const cachedResult = processedContentCache.get(messageId);
        if (cachedResult) {
          setProcessedContent(cachedResult);
          return;
        }

        // 处理 <think> 标签
        let result = content;
        const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
        const matches = result.matchAll(thinkRegex);

        const thinkContents: string[] = [];
        let lastIndex = 0;
        let processedResult = "";

        for (const match of matches) {
          const [fullMatch, thinkContent] = match;
          processedResult += result.slice(lastIndex, match.index);
          thinkContents.push(thinkContent.trim());
          lastIndex = (match.index || 0) + fullMatch.length;
        }

        // 添加剩余内容
        processedResult += result.slice(lastIndex);

        // 如果有 think 内容，将它们合并并添加引用符号
        if (thinkContents.length > 0) {
          const combinedThinkContent = thinkContents.join("");
          processedResult = `> ${combinedThinkContent}\n${processedResult}`;
        }

        processedContentCache.set(messageId, processedResult);
        setProcessedContent(processedResult);
      } catch (error) {
        console.error("Failed to process content:", error);
        setProcessedContent(content);
      } finally {
        isProcessingRef.current = false;
      }
    };

    processContent();

    return () => {
      processedContentCache.delete(messageId);
    };
  }, [content, messageId]);

  const createMessageFooter = (value: string) => (
    <Space size={token.paddingXXS}>
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
    <div className={styles.botMessage}>
      <div className={styles.messageSender}>AI</div>
      <div className={styles.messageText}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
      <div className={styles.messageTime}>
        {new Date(timestamp).toLocaleString()}
      </div>
      {!isError && (footer ? footer() : createMessageFooter(content))}
    </div>
  );
};

export default ResponseBubble;
