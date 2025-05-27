import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token, css }) => {
  return {
    topLinkWrapper: css`
      position: absolute;
      right: 30px;
      top: 10px;
      z-index: 10;
    `,
    bottomLinkWrapper: css`
      position: absolute;
      left: 20px;
      bottom: 8px;
      z-index: 10;
    `,
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: calc(100vh - 56px);
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
      overflow-x: hidden;
      position: relative;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      min-width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      box-sizing: border-box;
      transform-origin: left center;
      overflow-y: auto;
      overflow-x: hidden;
    `,
    menuCollapsed: css`
      width: 0;
      min-width: 0;
      padding: 0;
      opacity: 0;
      transform: translateX(-100%);
    `,
    chooseModel: css`
      display: flex;
      flex-direction: column;
      color: rgba(0, 0, 0, 0.88);
      margin: 16px 0;
      gap: 8px;
    `,
    conversations: css`
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      cursor: pointer;

      .ant-x-conversations-item {
        padding: 8px 12px;
        border-radius: ${token.borderRadius}px;

        &:hover {
          background-color: ${token.colorBgTextHover};
        }

        &.active {
          background-color: ${token.colorPrimaryBg};
          color: ${token.colorPrimary};
        }
      }
    `,
    footer: css`
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 16px 50px;
      color: rgba(0, 0, 0, 0.45);
      background-color: rgba(0, 0, 0, 0.02);
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    userProfile: css`
      display: flex;
      height: 30px;
      width: 100%;
      justify-content: flex-end;
      gap: 12px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${token.colorBorderSecondary};
      margin-bottom: 16px;
      img {
        padding-top: 4px;
        height: 30px;
      }
    `,
    newChatBtn: css`
      margin-bottom: 16px;
      height: 40px;
      font-size: 15px;
    `,
    functionMenu: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 8px;
      margin-bottom: 16px;
      padding: 4px 0;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    functionMenuItem: css`
      padding: 10px 16px;
      cursor: pointer;
      border-radius: ${token.borderRadius}px;

      &:hover {
        background-color: ${token.colorBgTextHover};
      }

      .anticon {
        font-size: 18px;
        margin-right: 8px;
      }

      span {
        font-size: 15px;
      }
    `,
    conversationsContainer: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      overflow: hidden;
    `,
    collapsedMenuBtn: css`
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 1000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${token.boxShadowSecondary};
      cursor: pointer;
      opacity: 1;
      transform: scale(1);

      &:hover {
        transform: scale(1.05);
      }
    `,
    pageContainer: css`
      flex: 1;
      display: none;
      opacity: 0;

      &.active {
        display: flex;
        flex-direction: column;
        opacity: 1;
      }
    `,
    menuPagesContainer: css`
      flex: 1;
      position: relative;
      overflow: hidden;
    `,
    menuPage: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      opacity: 0;
      background-color: ${token.colorBgContainer};
      overflow-y: auto;

      &.active {
        display: block;
        opacity: 1;
      }
    `,
  };
});
