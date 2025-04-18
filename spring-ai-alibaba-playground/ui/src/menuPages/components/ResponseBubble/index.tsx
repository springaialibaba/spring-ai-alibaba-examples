import React, { useState, useEffect, useRef, useMemo } from "react";
import { useStyle } from "./style";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getMarkdownRenderConfig, getSseTagProcessor } from "./utils";
import MessageFooter from "./components/CopyButton";

interface ResponseBubbleProps {
  content: string;
  timestamp: number;
  isError?: boolean;
  footer?: () => React.ReactNode;
}

const ResponseBubble: React.FC<ResponseBubbleProps> = ({
  content,
  timestamp,
  isError = false,
  footer = null,
}) => {
  const { styles } = useStyle();
  const [processedContent, setProcessedContent] = useState(content);
  const isProcessingRef = useRef(false);
  const messageId = `${timestamp}`;

  const markdownRenderConfig = useMemo(
    () => getMarkdownRenderConfig(styles),
    [styles]
  );
  const sseTagProcessor = useMemo(() => getSseTagProcessor(), []);

  useEffect(() => {
    const processContent = () => {
      if (isProcessingRef.current) return;
      const processedContent = sseTagProcessor(content, messageId);
      setProcessedContent(processedContent);
    };

    processContent();
  }, [content, timestamp]);

  return (
    <div className={styles.botMessage} key={"responseBubble" + messageId}>
      <div className={styles.messageSender}>AI</div>
      <div className={styles.messageText}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownRenderConfig as Components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
      <div className={styles.messageTime}>
        {new Date(timestamp).toLocaleString()}
      </div>
      {!isError && (footer?.() ?? <MessageFooter value={content} />)}
    </div>
  );
};

export default ResponseBubble;
