import React from "react";
import { CopyOutlined } from "@ant-design/icons";
import { Button, Space, theme } from "antd";

const MessageFooter = (props: { value: string }) => {
  const { token } = theme.useToken();
  return (
    <Space size={token.paddingXXS}>
      <Button
        color="default"
        variant="text"
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(props?.value);
        }}
        icon={<CopyOutlined />}
      />
    </Space>
  );
};

export default MessageFooter;
