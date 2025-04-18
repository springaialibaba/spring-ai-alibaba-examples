import React, { useState } from "react";
import { Button, Card, List, message, Popconfirm, Empty, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useStyles } from "../../style";
import { KnowledgeBase } from "../../types";
// import { createKnowledgeBase } from "../../../../api/rag";
import { useKnowledgeBaseStore } from "../../../../stores/knowledgeBase.store";
import CreateKnowledgeBaseModal from "../../../../menuPages/ragPage/components/CreateKnowledgeBaseModal";

interface KnowledgeBaseListProps {
  knowledgeBases: KnowledgeBase[];
  activeKnowledgeBaseId: string | null;
  onSelect: (knowledgeBase: KnowledgeBase) => void;
  onUpdate: () => void;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({
  knowledgeBases,
  activeKnowledgeBaseId,
  onSelect,
  onUpdate,
}) => {
  const { styles } = useStyles();
  const {
    knowledgeBases: storeKnowledgeBases,
    activeKnowledgeBase,
    selectKnowledgeBase,
    deleteKnowledgeBase,
  } = useKnowledgeBaseStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [knowledgeBaseName, setKnowledgeBaseName] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setKnowledgeBaseName("");
    setFileList([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async () => {
    if (!knowledgeBaseName.trim()) {
      message.error("请输入知识库名称");
      return;
    }

    if (fileList.length === 0) {
      message.error("请至少上传一个文件");
      return;
    }

    setIsSubmitting(true);
    // try {
    //   const files = fileList.map((file) => file.originFileObj);
    //   await createKnowledgeBase(knowledgeBaseName, files);
    //   message.success("知识库创建成功");
    //   setIsModalVisible(false);
    //   onUpdate();
    // } catch (error) {
    //   console.error("创建知识库失败:", error);
    //   message.error("创建知识库失败");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteKnowledgeBase(id);
      message.success("知识库删除成功");
      onUpdate();
    } catch (error) {
      console.error("删除知识库失败:", error);
      message.error("删除知识库失败");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelect = (id: string) => {
    selectKnowledgeBase(id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <div className={styles.knowledgeBaseHeader}>
        <h3>知识库列表</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新建知识库
        </Button>
      </div>
      <div className={styles.knowledgeBaseList}>
        {knowledgeBases?.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Empty
              description="暂无知识库"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                新建知识库
              </Button>
            </Empty>
          </div>
        ) : (
          <List
            dataSource={knowledgeBases}
            renderItem={(item) => (
              <Card
                key={item.id}
                className={`${styles.knowledgeBaseCard} ${
                  activeKnowledgeBaseId === item.id ? styles.activeCard : ""
                }`}
                title={item.name}
                extra={
                  <Popconfirm
                    title="确定要删除这个知识库吗?"
                    description="删除后将无法恢复"
                    onConfirm={() => handleDelete(item.id)}
                    okText="删除"
                    cancelText="取消"
                    disabled={isDeleting}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                      loading={isDeleting}
                    />
                  </Popconfirm>
                }
                onClick={() => handleSelect(item.id)}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title={`创建时间: ${formatDate(item.createdAt)}`}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {formatDate(item.createdAt)}
                  </Tooltip>
                </div>
              </Card>
            )}
          />
        )}
      </div>

      <CreateKnowledgeBaseModal
        visible={isModalVisible}
        onClose={handleCancel}
        onSuccess={handleCreate}
      />
    </>
  );
};

export default KnowledgeBaseList;
