import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sender } from "@ant-design/x";
import Masonry from "react-masonry-css";
import { useStyles } from "./style";
import TemplateImage from "./components/templateImage";
import BasePage from "../components/BasePage";
import { useConversationContext } from "../../stores/conversation.store";
import { MenuPage } from "../../stores/functionMenu.store";

interface ImageItem {
  id: string;
  prompt: string;
  path: string;
}

const ImageGenLandingView: React.FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [inputContent, setInputContent] = useState("");
  const [templateImages, setTemplateImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createConversation } = useConversationContext();

  // 加载创意模板图片
  useEffect(() => {
    fetch("/genImages/desc.json")
      .then((res) => res.json())
      .then((data: ImageItem[]) => {
        setTemplateImages(data);
      })
      .catch((error) => {
        console.error("加载创意模板失败:", error);
      });
  }, []);

  // 响应式布局配置
  const breakpointColumns = {
    default: 4,
    1400: 3,
    1100: 2,
    700: 1,
  };

  const handleUseTemplate = (prompt: string) => {
    setInputContent(prompt);
  };

  const handleCreateConversation = (prompt: string) => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const newConversation = createConversation(MenuPage.ImageGen, []);
      navigate(
        `/image-gen/${newConversation.id}?prompt=${encodeURIComponent(prompt)}`
      );
    } catch (error) {
      console.error("创建图像生成会话错误:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputArea}>
        <Sender
          value={inputContent}
          onChange={setInputContent}
          onSubmit={handleCreateConversation}
          placeholder="输入提示词开始生成图片..."
          className={styles.sender}
          loading={isLoading}
        />
      </div>

      <div>
        <h2 style={{ margin: "0 0 16px" }}>创意灵感</h2>
        <Masonry
          breakpointCols={breakpointColumns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryColumn}
        >
          {[...templateImages].map((image) => (
            <TemplateImage
              key={image.id}
              id={image.id}
              path={image.path}
              prompt={image.prompt}
              onUseCreative={handleUseTemplate}
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default ImageGenLandingView;
