import React, { useState } from "react";
import { Modal, Form, Input, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useStyles } from "../../style";
// import { createKnowledgeBase } from "../../../../api/rag";

interface CreateKnowledgeBaseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateKnowledgeBaseModal = ({
  visible,
  onClose,
  onSuccess,
}: CreateKnowledgeBaseModalProps) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // 重置表单
  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  // TODO: 需要和服务端商量下 RAG 的流程和规范
  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        message.error("请至少上传一个文件");
        return;
      }

      setLoading(true);

      // 准备文件
      const files = fileList.map((file) => file.originFileObj as File);

      // 调用API创建知识库
      // await createKnowledgeBase(values.name, files);

      message.success("知识库创建成功");
      handleCancel();
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`创建失败: ${error.message}`);
      } else {
        message.error("创建失败，请重试");
      }
      console.error("创建知识库失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件列表变化
  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      title="新建知识库"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="创建"
      cancelText="取消"
      maskClosable={false}
      destroyOnClose
      className={styles.uploadModal}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="name"
          label="知识库名称"
          rules={[{ required: true, message: "请输入知识库名称" }]}
        >
          <Input placeholder="请输入知识库名称" maxLength={30} showCount />
        </Form.Item>

        <Form.Item
          label="上传文件"
          required
          tooltip="支持PDF、DOCX、TXT等文本文件"
        >
          <Upload.Dragger
            multiple
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            accept=".pdf,.docx,.doc,.txt,.md"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，文件大小不超过10MB
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateKnowledgeBaseModal;
