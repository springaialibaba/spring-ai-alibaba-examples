import { message } from "antd";
import type { GetProp, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// 限制文件大小
export const litFileSize = (file: FileType, size: number) => {
  const isLt2M = file.size / 1024 / size < 1;
  if (!isLt2M) {
    message.error(`Image must smaller than ${size}KB!`);
  }
  return isLt2M;
};

export const decoder = new TextDecoder("utf-8");
