import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    height: calc(100vh - 116px);
    padding: 48px 12px 12px;
    background: ${token.colorBgLayout};
  `,
  leftPanel: css`
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 12px;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    /* box-shadow: ${token.boxShadow}; */
    overflow: hidden;
  `,
  rightPanel: css`
    width: calc(60% - 12px);
    height: 100%;
    padding-left: 16px;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    /* box-shadow: ${token.boxShadow}; */
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  knowledgeBaseList: css`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  `,
  knowledgeBaseHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  knowledgeBaseCard: css`
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
      border-color: ${token.colorPrimary};
    }
  `,
  activeCard: css`
    border-color: ${token.colorPrimary};
    background-color: ${token.colorPrimaryBg};
  `,
  senderWrapper: css`
    padding: 16px;
    border-top: 1px solid ${token.colorBorderSecondary};
    margin-top: auto;
  `,
  messagesContainer: css`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  uploadModal: css`
    .ant-upload-list {
      max-height: 300px;
      overflow-y: auto;
    }
  `,
  placeholderText: css`
    text-align: center;
    color: ${token.colorTextSecondary};
    margin-top: 100px;
  `,
  placeholderImage: css`
    width: 120px;
    height: 120px;
    margin-bottom: 16px;
    opacity: 0.6;
  `,
  emptyContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  `,
}));
