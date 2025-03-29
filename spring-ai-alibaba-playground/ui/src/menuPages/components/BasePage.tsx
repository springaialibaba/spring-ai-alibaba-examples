import React from "react";
import { Typography } from "antd";

interface BasePageProps {
  title: string;
  children?: React.ReactNode;
}

const BasePage: React.FC<BasePageProps> = ({ title, children }) => {
  return (
    <div style={{ padding: "24px" }}>
      <Typography.Title level={2}>{title}</Typography.Title>
      {children}
    </div>
  );
};

export default BasePage;
